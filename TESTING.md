# Testing Guide

## Overview

This project uses **Vitest** for unit/integration testing and **React Testing Library** for component testing.

## Getting Started

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage

# Run security scanner (Phase 15)
npm run security:scan
```

### Test Structure

```
src/
├── lib/
│   ├── photographyPricing.ts
│   └── photographyPricing.test.ts    # Unit tests
├── components/
│   └── ui/
│       ├── button.tsx
│       └── button.test.tsx           # Component tests
└── test/
    ├── setup.ts                      # Global test setup
    └── utils.tsx                     # Custom render function
```

## Writing Tests

### Unit Tests (Pure Functions)

```typescript
// lib/utils.test.ts
import { describe, it, expect } from 'vitest';
import { calculateDiscount } from './utils';

describe('calculateDiscount', () => {
  it('should calculate 10% discount correctly', () => {
    expect(calculateDiscount(100, 10)).toBe(90);
  });

  it('should handle zero discount', () => {
    expect(calculateDiscount(100, 0)).toBe(100);
  });
});
```

### Component Tests

```typescript
// components/Button.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/utils';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('should render button text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should call onClick when clicked', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    
    render(<Button onClick={handleClick}>Click me</Button>);
    await user.click(screen.getByText('Click me'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByText('Disabled')).toBeDisabled();
  });
});
```

### Hook Tests

```typescript
// hooks/useDebounce.test.ts
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  it('should debounce value changes', async () => {
    vi.useFakeTimers();
    
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'initial' } }
    );

    expect(result.current).toBe('initial');

    rerender({ value: 'updated' });
    expect(result.current).toBe('initial');

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current).toBe('updated');
    
    vi.useRealTimers();
  });
});
```

## Testing Patterns

### 1. Arrange-Act-Assert (AAA)

```typescript
it('should add item to cart', () => {
  // Arrange
  const cart = [];
  const item = { id: 1, name: 'Product' };
  
  // Act
  const result = addToCart(cart, item);
  
  // Assert
  expect(result).toHaveLength(1);
  expect(result[0]).toBe(item);
});
```

### 2. Test User Behavior, Not Implementation

```typescript
// ❌ Bad - Testing implementation details
it('should update state', () => {
  const { result } = renderHook(() => useState(0));
  expect(result.current[0]).toBe(0);
});

// ✅ Good - Testing user-visible behavior
it('should increment counter when button clicked', async () => {
  render(<Counter />);
  await userEvent.click(screen.getByRole('button', { name: /increment/i }));
  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});
```

### 3. Use Testing Library Queries

Priority order:
1. `getByRole` - Accessible to screen readers
2. `getByLabelText` - Form elements
3. `getByPlaceholderText` - Input placeholders
4. `getByText` - Text content
5. `getByTestId` - Last resort only

```typescript
// ✅ Good - Semantic queries
screen.getByRole('button', { name: /submit/i });
screen.getByLabelText(/email address/i);

// ❌ Avoid - Test IDs unless absolutely necessary
screen.getByTestId('submit-button');
```

## Mocking

### Mocking Functions

```typescript
import { vi } from 'vitest';

const mockFn = vi.fn();
mockFn.mockReturnValue(42);
mockFn.mockResolvedValue({ data: 'success' });
```

### Mocking Modules

```typescript
// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockResolvedValue({ data: [], error: null }),
    })),
  },
}));
```

### Mocking React Router

```typescript
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useParams: () => ({ id: '123' }),
  };
});
```

## Coverage Goals

- **Business Logic**: 90%+ (pricing, calculations, validation)
- **Components**: 80%+ (UI components, forms)
- **Utilities**: 90%+ (helpers, formatters)
- **Overall**: 80%+

### View Coverage

```bash
npm run test:coverage
open coverage/index.html
```

## CI/CD Integration

Tests and security scans run automatically on:
- Every pull request
- Before deployment
- Nightly builds

### GitHub Actions Example

```yaml
name: Tests and Security

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install Dependencies
        run: npm ci
      
      - name: Security Scan
        run: npm run security:scan
      
      - name: Run Tests
        run: npm test
      
      - name: Coverage Report
        run: npm run test:coverage
```

### Test Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "security:scan": "tsx scripts/security-scanner.ts"
  }
}
```

## Security Scanner (Phase 15)

The automated security scanner detects type safety issues:

### Detection Capabilities
- 🔴 **Critical**: `any` type annotations
- 🔴 **Critical**: Unsafe `as any` assertions  
- 🟡 **Medium**: Untyped arrow function parameters
- 🔴 **Critical**: Missing Zod validation in edge functions

### Running the Scanner
```bash
npm run security:scan
```

### Sample Output
```
🔍 Security Scanner Results
═══════════════════════════════════════════════════════════

📊 Summary:
   🔴 Critical: 0
   🟠 High: 0
   🟡 Medium: 2
   🟢 Low: 1
   Total: 3

🟡 MEDIUM Issues (2):

1. src/components/Example.tsx:45
   Type: untyped-param
   Untyped parameter 'item' in arrow function
   Code: items.map(item => item.name)
```

The scanner exits with code 1 if critical issues are found, making it perfect for CI/CD integration.

## Best Practices

1. **Test Behavior, Not Implementation**
   - Focus on what the user sees/does
   - Avoid testing internal state

2. **Keep Tests Simple**
   - One assertion per test (ideally)
   - Clear test names describing behavior

3. **Use Descriptive Test Names**
   ```typescript
   // ✅ Good
   it('should show error message when email is invalid')
   
   // ❌ Bad
   it('test 1')
   ```

4. **Avoid Testing Library Code**
   - Don't test React, React Router, etc.
   - Trust that libraries work

5. **Test Edge Cases**
   - Empty states
   - Error conditions
   - Loading states
   - Boundary values

6. **Clean Up After Tests**
   - Use cleanup functions
   - Reset mocks with `beforeEach`

## Debugging Tests

### VSCode Debugging

Add to `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Tests",
  "runtimeExecutable": "npm",
  "runtimeArgs": ["run", "test"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

### Using `debug` Helper

```typescript
import { render, screen } from '@/test/utils';

it('should render component', () => {
  const { debug } = render(<MyComponent />);
  debug(); // Prints DOM tree
});
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)
- [Common Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Zod Documentation](https://zod.dev/) - Runtime validation schemas

## Examples

See `src/lib/photographyPricing.test.ts` for a complete example of unit tests with full coverage.

See `scripts/security-scanner.ts` for the automated type safety scanner implementation.
