# Services Layer

This directory contains service classes that encapsulate business logic and external API interactions.

## Purpose

Services provide:
- **Abstraction** - Hide implementation details from components
- **Reusability** - Share logic across multiple components
- **Testability** - Easy to mock and test in isolation
- **Separation of Concerns** - Keep components focused on UI

## Structure

```
lib/services/
├── README.md           # This file
├── LocationService.ts  # Address geocoding, validation
├── PhotographerService.ts  # Photographer matching, assignment
├── OrderService.ts     # Order management operations
└── StorageService.ts   # File upload/download operations
```

## Naming Conventions

- Use PascalCase for class names: `LocationService`
- Use camelCase for methods: `geocodeAddress()`
- Suffix service files with `Service.ts`

## Example Service

```typescript
// LocationService.ts
import { supabase } from '@/integrations/supabase/client';

export class LocationService {
  /**
   * Geocode an address using Mapbox API
   */
  async geocodeAddress(address: string): Promise<{ lat: number; lng: number }> {
    // Implementation
  }

  /**
   * Calculate driving distance between two points
   */
  async calculateDistance(
    origin: { lat: number; lng: number },
    destination: { lat: number; lng: number }
  ): Promise<number> {
    // Implementation
  }
}

export const locationService = new LocationService();
```

## Usage in Components

```typescript
import { locationService } from '@/lib/services/LocationService';

const MyComponent = () => {
  const handleGeocode = async () => {
    const coords = await locationService.geocodeAddress('Berlin, Germany');
    console.log(coords);
  };
  
  return <button onClick={handleGeocode}>Geocode</button>;
};
```

## Testing Services

```typescript
import { describe, it, expect, vi } from 'vitest';
import { locationService } from './LocationService';

describe('LocationService', () => {
  it('should geocode an address', async () => {
    const result = await locationService.geocodeAddress('Berlin');
    expect(result).toHaveProperty('lat');
    expect(result).toHaveProperty('lng');
  });
});
```

## Guidelines

1. **Single Responsibility** - Each service handles one domain
2. **Stateless** - Avoid storing state in services (use hooks for state)
3. **Async by Default** - Most service methods are async
4. **Error Handling** - Services should throw typed errors
5. **Type Safety** - Use TypeScript interfaces for all parameters
