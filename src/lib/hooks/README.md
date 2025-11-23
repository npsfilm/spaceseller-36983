# Custom Hooks

This directory contains reusable React hooks that encapsulate common logic patterns.

## Purpose

Custom hooks provide:
- **State Management** - Shared state logic across components
- **Side Effects** - Reusable useEffect patterns
- **API Integration** - Consistent data fetching patterns
- **Form Logic** - Validation and submission handling

## Structure

```
lib/hooks/
├── README.md              # This file
├── useLocationValidation.ts  # Location/address validation
├── useOrderSteps.ts       # Order wizard step management
├── usePhotographerMatch.ts   # Photographer availability
├── useFormValidation.ts   # Generic form validation
└── useDebounce.ts         # Debounced values
```

## Naming Conventions

- Always prefix with `use`: `useMyHook`
- Use camelCase: `useOrderSteps`
- Be descriptive: `useLocationValidation` not `useLocation`

## Example Hook

```typescript
// useDebounce.ts
import { useEffect, useState } from 'react';

/**
 * Debounce a value by the specified delay
 */
export const useDebounce = <T>(value: T, delay: number = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
```

## Usage in Components

```typescript
import { useDebounce } from '@/lib/hooks/useDebounce';

const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    // API call with debounced value
    fetchResults(debouncedSearch);
  }, [debouncedSearch]);

  return <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />;
};
```

## Testing Hooks

```typescript
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
    expect(result.current).toBe('initial'); // Still old value

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current).toBe('updated'); // Now updated

    vi.useRealTimers();
  });
});
```

## Hook Categories

### Data Fetching Hooks
- Use React Query for server state
- Return `{ data, isLoading, error }` pattern

### Form Hooks
- Handle validation, submission, errors
- Return `{ values, errors, handleSubmit, handleChange }`

### UI State Hooks
- Manage UI-specific state (modals, dropdowns)
- Return `{ isOpen, open, close, toggle }`

### Utility Hooks
- Generic reusable logic
- Return computed values or helper functions

## Guidelines

1. **Single Responsibility** - One hook, one purpose
2. **Composability** - Hooks can call other hooks
3. **Dependencies** - Always list dependencies correctly
4. **Cleanup** - Return cleanup functions when needed
5. **TypeScript** - Use generics for flexible typing
6. **Docs** - Add JSDoc comments for complex hooks
