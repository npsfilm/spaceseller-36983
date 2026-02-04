
# Phase 18: Performance-Optimierung

## Analyse der aktuellen Situation

### 1. Code-Splitting Status

| Bereich | Aktueller Status | Problem |
|---------|------------------|---------|
| **App.tsx Routen** | Alle 21 Routen synchron importiert | Bundle enthält gesamten Code |
| **Dashboard.tsx** | ✅ Lazy Loading implementiert | Gutes Beispiel |
| **Admin Pages** | Keine Lazy Imports | 8 Admin-Pages laden beim Start |
| **Order Wizard** | Synchroner Import | Komplex, sollte lazy sein |
| **Freelancer Dashboard** | Keine Lazy Imports | Belastet initiales Bundle |

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                    AKTUELLES BUNDLE (GESCHÄTZT)                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  SYNCHRON GELADEN (App.tsx):                                            │
│  ├── Home, Auth, ResetPassword (Essential)            ~50 KB            │
│  ├── Dashboard, MyOrders, Settings                    ~80 KB            │
│  ├── Order Wizard (6 Steps, viele Komponenten)        ~150 KB           │
│  ├── Admin (8 Pages, AdminLayout, Tables)             ~200 KB           │
│  ├── Freelancer Dashboard                             ~100 KB           │
│  └── Legal Pages (Impressum, Datenschutz, AGB)        ~20 KB            │
│                                                                          │
│  TOTAL: ~600 KB initial JavaScript                                      │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2. Bild-Optimierung Status

| Bereich | Aktueller Status | Problem |
|---------|------------------|---------|
| **Asset-Anzahl** | 68 JPG-Dateien in src/assets | Keine Kompression |
| **Import-Methode** | Direkter Import (import x from '*.jpg') | Kein Lazy Loading |
| **Responsive Images** | Nicht implementiert | Keine srcset/sizes |
| **Lazy Loading** | Nicht implementiert | Alle Bilder laden sofort |

Betroffene Dateien:
- `CategorySelectionStep.tsx`: 4 große JPG-Imports
- `VirtualStagingConfigStep.tsx`: Placeholder-Bilder
- `Header.tsx`: Logo-Import

### 3. React Query Status

| Hook | staleTime | gcTime | Optimistic Updates |
|------|-----------|--------|-------------------|
| `useDashboardData` | 60s | 300s | ❌ |
| `useOrders` | 30s | 300s | ❌ |
| `useAssignments` | 30s | 300s | ❌ |
| `useAdminOrders` | ❌ Nicht React Query | - | ❌ |

---

## Plan: Performance-Optimierung

### 1. Code-Splitting für Routen

#### 1.1 Lazy Routes in App.tsx

```typescript
// src/App.tsx - NACHHER

import { Suspense, lazy } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// Critical path - loaded synchronously
import Home from "./pages/Home";
import Auth from "./pages/Auth";

// Lazy-loaded routes
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Order = lazy(() => import("./pages/Order"));
const OrderConfirmation = lazy(() => import("./pages/OrderConfirmation"));
const MyOrders = lazy(() => import("./pages/MyOrders"));
const ClientOrderDetail = lazy(() => import("./pages/client/OrderDetail"));
const Settings = lazy(() => import("./pages/Settings"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Onboarding = lazy(() => import("./pages/Onboarding"));

// Admin routes (grouped)
const Admin = lazy(() => import("./pages/Admin"));
const AdminOrderDetail = lazy(() => import("./pages/admin/OrderDetail"));
const PhotographerManagement = lazy(() => import("./pages/admin/PhotographerManagement"));
const PhotographerLocations = lazy(() => import("./pages/admin/PhotographerLocations"));
const PhotographerReliability = lazy(() => import("./pages/admin/PhotographerReliability"));
const UserRoleManagement = lazy(() => import("./pages/admin/UserRoleManagement"));
const SecurityMonitor = lazy(() => import("./pages/admin/SecurityMonitor"));
const PageOverview = lazy(() => import("./pages/admin/PageOverview"));
const WebsiteSettings = lazy(() => import("./pages/admin/WebsiteSettings"));

// Freelancer routes
const FreelancerDashboard = lazy(() => import("./pages/FreelancerDashboard"));

// Legal pages (low priority)
const Impressum = lazy(() => import("./pages/Impressum"));
const Datenschutz = lazy(() => import("./pages/Datenschutz"));
const AGB = lazy(() => import("./pages/AGB"));
const NotFound = lazy(() => import("./pages/NotFound"));
```

#### 1.2 Optimierter Loading-Fallback

```typescript
// src/components/ui/PageSkeleton.tsx - NEU

const PageSkeleton = ({ variant = 'default' }: { variant?: 'default' | 'dashboard' | 'form' }) => {
  if (variant === 'dashboard') {
    return (
      <div className="min-h-screen bg-background p-8 space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-32" />)}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
    </div>
  );
};
```

### 2. Bild-Optimierung

#### 2.1 Optimized Image Component

```typescript
// src/components/ui/OptimizedImage.tsx - NEU

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  aspectRatio?: number;
}

export const OptimizedImage = ({
  src,
  alt,
  className,
  priority = false,
  sizes = '100vw',
  aspectRatio
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (priority) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    if (imgRef.current) observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, [priority]);

  return (
    <div 
      ref={imgRef}
      className={cn(
        'relative overflow-hidden bg-muted',
        aspectRatio && `aspect-[${aspectRatio}]`,
        className
      )}
    >
      {/* Blur placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-muted via-muted/50 to-muted" />
      )}
      
      {isInView && (
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
        />
      )}
    </div>
  );
};
```

#### 2.2 Vite Image Optimization Plugin

```typescript
// vite.config.ts - ERGÄNZUNG

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => ({
  // ... existing config
  
  build: {
    rollupOptions: {
      output: {
        // Separate vendor chunks
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['framer-motion', '@radix-ui/react-dialog', '@radix-ui/react-select'],
          'query-vendor': ['@tanstack/react-query'],
          'map-vendor': ['mapbox-gl', '@mapbox/mapbox-sdk'],
        }
      }
    },
    // Enable source map for production debugging
    sourcemap: mode === 'development',
    // Optimize chunk size
    chunkSizeWarningLimit: 500,
  },

  // Optimize asset handling
  assetsInclude: ['**/*.jpg', '**/*.png', '**/*.svg'],
}));
```

### 3. React Query Optimierung

#### 3.1 Zentrale Query-Konfiguration

```typescript
// src/lib/queryConfig.ts - NEU

export const QUERY_KEYS = {
  // Dashboard
  dashboardStats: (userId: string) => ['dashboard-stats', userId] as const,
  orderCount: (userId: string) => ['order-count', userId] as const,
  
  // Orders
  userOrders: (userId: string) => ['user-orders', userId] as const,
  orderDetail: (orderId: string) => ['order-detail', orderId] as const,
  recentOrders: (userId: string) => ['recent-orders', userId] as const,
  activeOrders: (userId: string) => ['active-orders', userId] as const,
  
  // Admin
  adminOrders: () => ['admin-orders'] as const,
  adminStats: () => ['admin-stats'] as const,
  
  // Assignments
  photographerAssignments: (userId: string) => ['photographer-assignments', userId] as const,
  
  // Profile
  profile: (userId: string) => ['profile', userId] as const,
} as const;

export const STALE_TIMES = {
  // Rarely changing data
  profile: 5 * 60 * 1000, // 5 minutes
  
  // Moderate frequency
  dashboardStats: 60 * 1000, // 1 minute
  
  // Frequently changing
  orders: 30 * 1000, // 30 seconds
  assignments: 30 * 1000, // 30 seconds
  
  // Real-time needs
  activeOrders: 15 * 1000, // 15 seconds
} as const;

export const GC_TIMES = {
  default: 5 * 60 * 1000, // 5 minutes
  long: 15 * 60 * 1000, // 15 minutes
} as const;
```

#### 3.2 Optimistic Updates für Assignments

```typescript
// src/lib/hooks/useAssignments.ts - OPTIMISTIC UPDATES

const acceptMutation = useMutation({
  mutationFn: async ({ assignmentId, assignment }: AcceptParams) => {
    await assignmentDataService.acceptAssignment(assignmentId);
    await assignmentDataService.createAdminNotification(...);
  },
  
  // OPTIMISTIC UPDATE
  onMutate: async ({ assignmentId }) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ 
      queryKey: QUERY_KEYS.photographerAssignments(user!.id) 
    });
    
    // Snapshot previous value
    const previousAssignments = queryClient.getQueryData<Assignment[]>(
      QUERY_KEYS.photographerAssignments(user!.id)
    );
    
    // Optimistically update
    queryClient.setQueryData<Assignment[]>(
      QUERY_KEYS.photographerAssignments(user!.id),
      (old) => old?.map(a => 
        a.id === assignmentId 
          ? { ...a, status: 'accepted' }
          : a
      )
    );
    
    return { previousAssignments };
  },
  
  onError: (err, variables, context) => {
    // Rollback on error
    if (context?.previousAssignments) {
      queryClient.setQueryData(
        QUERY_KEYS.photographerAssignments(user!.id),
        context.previousAssignments
      );
    }
    toast.error('Fehler beim Annehmen des Auftrags');
  },
  
  onSettled: () => {
    queryClient.invalidateQueries({ 
      queryKey: QUERY_KEYS.photographerAssignments(user!.id) 
    });
  }
});
```

#### 3.3 Prefetching für Order Flow

```typescript
// src/pages/Dashboard.tsx - PREFETCH ORDER WIZARD

import { useQueryClient } from '@tanstack/react-query';

const DashboardContent = () => {
  const queryClient = useQueryClient();
  
  // Prefetch Order Wizard data on dashboard mount
  useEffect(() => {
    // Prefetch services data
    queryClient.prefetchQuery({
      queryKey: ['services'],
      queryFn: () => supabase.from('services').select('*'),
      staleTime: STALE_TIMES.profile,
    });
  }, [queryClient]);
  
  // ...
};
```

#### 3.4 Migration von useAdminOrders zu React Query

```typescript
// src/lib/hooks/useAdminOrders.ts - MIGRATION

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS, STALE_TIMES, GC_TIMES } from '@/lib/queryConfig';

export const useAdminOrders = () => {
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: QUERY_KEYS.adminOrders(),
    queryFn: () => adminOrderService.fetchAllOrders(),
    staleTime: STALE_TIMES.orders,
    gcTime: GC_TIMES.default,
  });

  const stats = useMemo(() => 
    adminOrderService.calculateStats(orders), 
    [orders]
  );

  const refreshOrders = () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminOrders() });
  };

  return { orders, stats, isLoading, refreshOrders };
};
```

---

## Zusammenfassung der Dateien

| Aktion | Datei | Beschreibung |
|--------|-------|--------------|
| **EDIT** | `src/App.tsx` | Lazy Loading für 19 Routen |
| **NEU** | `src/components/ui/PageSkeleton.tsx` | Loading-Fallback Komponente |
| **NEU** | `src/components/ui/OptimizedImage.tsx` | Lazy-Loaded Image mit Intersection Observer |
| **EDIT** | `vite.config.ts` | Chunk-Splitting Konfiguration |
| **NEU** | `src/lib/queryConfig.ts` | Zentrale Query-Keys und Caching-Zeiten |
| **EDIT** | `src/lib/hooks/useAssignments.ts` | Optimistic Updates |
| **EDIT** | `src/lib/hooks/useAdminOrders.ts` | Migration zu React Query |
| **EDIT** | `src/pages/Order/steps/CategorySelectionStep.tsx` | OptimizedImage verwenden |
| **EDIT** | `src/pages/Dashboard.tsx` | Prefetching hinzufügen |

---

## Erwartete Verbesserungen

### Bundle Size Reduktion

| Metrik | Vorher | Nachher | Verbesserung |
|--------|--------|---------|--------------|
| Initial JS Bundle | ~600 KB | ~150 KB | -75% |
| Admin Bundle | In Initial | Separate ~200 KB Chunk | On-demand |
| Order Wizard | In Initial | Separate ~150 KB Chunk | On-demand |

### Ladezeit Verbesserungen

| Metrik | Vorher | Nachher | Verbesserung |
|--------|--------|---------|--------------|
| First Contentful Paint | ~2.5s | ~1.2s | -52% |
| Largest Contentful Paint | ~4.0s | ~2.0s | -50% |
| Time to Interactive | ~3.5s | ~1.8s | -49% |

### UX Verbesserungen

| Feature | Vorher | Nachher |
|---------|--------|---------|
| Bild-Laden | Blocking | Progressive mit Placeholder |
| Assignment Accept/Decline | Warten auf Response | Sofortiges UI-Feedback |
| Navigation zwischen Pages | Neu-Laden | Cached Daten + Background Refresh |
| Order Wizard Start | Warten auf Services-Load | Prefetched auf Dashboard |

---

## Technische Details

### Chunk-Splitting Strategie

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                    NEUE BUNDLE-STRUKTUR                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  INITIAL BUNDLE (~150 KB):                                              │
│  ├── React Core + Router                                                │
│  ├── App.tsx (lazy imports)                                             │
│  ├── AuthContext, ProtectedRoute                                        │
│  ├── Home.tsx (redirect logic)                                          │
│  └── Auth.tsx (login/signup)                                            │
│                                                                          │
│  VENDOR CHUNKS:                                                         │
│  ├── react-vendor.js (~40 KB)                                           │
│  ├── ui-vendor.js (~80 KB) - framer-motion, radix                       │
│  ├── query-vendor.js (~30 KB) - react-query                             │
│  └── map-vendor.js (~100 KB) - mapbox (nur bei Bedarf)                  │
│                                                                          │
│  LAZY-LOADED CHUNKS:                                                    │
│  ├── dashboard-chunk.js (~80 KB)                                        │
│  ├── order-wizard-chunk.js (~150 KB)                                    │
│  ├── admin-chunk.js (~200 KB)                                           │
│  ├── freelancer-chunk.js (~100 KB)                                      │
│  └── legal-chunk.js (~20 KB)                                            │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### React Query Caching Übersicht

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                    CACHING STRATEGIE                                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  PROFILE DATA (staleTime: 5min)                                         │
│  └── Selten ändernd, lange cachen                                       │
│                                                                          │
│  DASHBOARD STATS (staleTime: 1min)                                      │
│  └── Moderate Frequenz, Background-Refresh                              │
│                                                                          │
│  ORDERS / ASSIGNMENTS (staleTime: 30s)                                  │
│  └── Häufiger, mit Realtime-Subscription                                │
│                                                                          │
│  ACTIVE ORDERS (staleTime: 15s)                                         │
│  └── Kritisch für UX, kurzes Caching                                    │
│                                                                          │
│  OPTIMISTIC UPDATES:                                                    │
│  ├── Assignment Accept/Decline                                          │
│  └── Order Status Changes (Admin)                                       │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```
