
# Optimierung des Frontend Error Trackings

## Analyse der aktuellen Implementierung

Die bestehende `errorTracking.ts` nutzt bereits das Sentry SDK korrekt mit:
- PII-Scrubbing via `beforeSend`
- User Context über `setUser`/`clearUser`  
- Custom Breadcrumbs

Es fehlen jedoch wichtige Features für produktionsreifes Error Tracking.

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                    AKTUELLE LÜCKEN                                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  1. KEINE SENTRY ERROR BOUNDARY                                         │
│     └── React-Render-Fehler werden nicht automatisch erfasst            │
│                                                                          │
│  2. KEINE REACT ROUTER INTEGRATION                                       │
│     └── Route-Wechsel fehlen in Breadcrumbs                             │
│                                                                          │
│  3. SOURCE MAPS NUR IN DEVELOPMENT                                       │
│     └── Produktion zeigt minifizierten Code                             │
│                                                                          │
│  4. KEIN RELEASE TRACKING                                                │
│     └── Fehler können nicht App-Versionen zugeordnet werden             │
│                                                                          │
│  5. GERINGE NUTZUNG                                                      │
│     └── errorTracker.captureError nur in AuthContext verwendet          │
│                                                                          │
│  6. KEIN REPLAY INTEGRATION                                              │
│     └── Keine Session-Aufzeichnung bei Fehlern                          │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Geplante Verbesserungen

### 1. Erweiterte Sentry-Konfiguration

Die `errorTracking.ts` wird um folgende Features erweitert:

| Feature | Beschreibung | Nutzen |
|---------|--------------|--------|
| **React Router Integration** | Automatische Route-Breadcrumbs | Besseres Debugging |
| **Browser Tracing** | Performance-Monitoring | LCP, FCP, TTFB Metriken |
| **Session Replay** | Video-Aufzeichnung bei Errors | Fehler visuell nachvollziehen |
| **Release Tracking** | Version aus package.json | Fehler pro Release zuordnen |

```typescript
// Erweiterte Sentry.init() Konfiguration
Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: isProduction ? 'production' : 'development',
  release: `spaceseller@${APP_VERSION}`,
  
  integrations: [
    // Bestehende Breadcrumbs
    Sentry.breadcrumbsIntegration({ ... }),
    
    // NEU: React Router Integration
    Sentry.reactRouterV6BrowserTracingIntegration({
      useEffect: React.useEffect,
      useLocation,
      useNavigationType,
      createRoutesFromChildren,
      matchRoutes,
    }),
    
    // NEU: Session Replay (nur bei Errors)
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  
  // NEU: Replay Sample Rates
  replaysSessionSampleRate: 0, // Keine normalen Sessions
  replaysOnErrorSampleRate: 1.0, // Alle Error-Sessions
});
```

### 2. Sentry Error Boundary in App.tsx

React-Render-Fehler werden automatisch erfasst:

```typescript
// App.tsx - Mit Sentry.ErrorBoundary
import * as Sentry from '@sentry/react';

const App = () => (
  <Sentry.ErrorBoundary 
    fallback={<GlobalErrorFallback />}
    showDialog={false}
  >
    <QueryClientProvider client={queryClient}>
      {/* ... bestehender Code ... */}
    </QueryClientProvider>
  </Sentry.ErrorBoundary>
);
```

### 3. Source Maps in Produktion

Die `vite.config.ts` wird angepasst:

```typescript
build: {
  // Source Maps auch in Produktion für Sentry
  sourcemap: true, // War: mode === 'development'
}
```

**Hinweis**: Source Maps werden nur an Sentry gesendet und sind für Endnutzer nicht sichtbar.

### 4. Neue GlobalErrorFallback Komponente

Eine benutzerfreundliche Fallback-UI für schwere Fehler:

```typescript
// src/components/ui/GlobalErrorFallback.tsx
const GlobalErrorFallback = () => (
  <div className="min-h-screen flex items-center justify-center p-4">
    <Card className="max-w-md">
      <CardHeader>
        <AlertTriangle className="h-12 w-12 text-destructive" />
        <CardTitle>Ein Fehler ist aufgetreten</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Die Seite konnte nicht geladen werden.</p>
        <Button onClick={() => window.location.reload()}>
          Seite neu laden
        </Button>
      </CardContent>
    </Card>
  </div>
);
```

### 5. Erweiterte Nutzung im Codebase

Integration in kritische Bereiche:

```typescript
// Beispiel: Order Submission
try {
  await orderSubmissionService.submitOrder(orderState);
} catch (error) {
  errorTracker.captureError(error as Error, {
    action: 'order_submission',
    orderId: orderState.id,
    route: '/order',
  });
  throw error;
}

// Beispiel: API-Fehler im React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError: (error) => {
        errorTracker.captureError(error as Error, { 
          action: 'query_error' 
        });
      },
    },
  },
});
```

---

## Dateiänderungen

| Aktion | Datei | Beschreibung |
|--------|-------|--------------|
| **EDIT** | `src/lib/errorTracking.ts` | React Router + Replay Integration |
| **EDIT** | `src/App.tsx` | Sentry.ErrorBoundary wrappen |
| **EDIT** | `vite.config.ts` | Source Maps in Produktion aktivieren |
| **NEU** | `src/components/ui/GlobalErrorFallback.tsx` | Error Fallback UI |

---

## Voraussetzungen

### Secret konfigurieren

Der `VITE_SENTRY_DSN` muss als Umgebungsvariable gesetzt werden:

1. Sentry-Projekt auf sentry.io erstellen
2. DSN kopieren (Format: `https://xxx@o123.ingest.sentry.io/456`)
3. In Lovable Cloud als Secret speichern

---

## Architektur nach Implementierung

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                    OPTIMIERTE ERROR TRACKING ARCHITEKTUR                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  BROWSER                                                                │
│  ├── Sentry.ErrorBoundary (React Render-Fehler)                         │
│  ├── window.onerror / unhandledrejection (Global)                       │
│  ├── errorTracker.captureError() (Manuell)                              │
│  └── React Router Breadcrumbs (Navigation)                              │
│                                                                          │
│  SENTRY SDK FEATURES:                                                   │
│  ├── beforeSend → PII Scrubbing (Passwörter, IBANs, etc.)               │
│  ├── breadcrumbsIntegration → Console, DOM, Fetch, History             │
│  ├── reactRouterV6BrowserTracingIntegration → Route-Wechsel            │
│  ├── replayIntegration → Session-Video bei Errors                       │
│  └── release: spaceseller@X.Y.Z → Version-Tracking                      │
│                                                                          │
│  DATENFLUSS:                                                            │
│  Browser → beforeSend (Scrubbing) → Sentry Cloud                        │
│         └── Source Maps (versteckt) ────────┘                           │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Erwartete Verbesserungen

| Metrik | Vorher | Nachher |
|--------|--------|---------|
| React Render-Fehler erfasst | Nein | Ja (via ErrorBoundary) |
| Route-Context in Fehlern | Manuell | Automatisch |
| Stack Traces lesbar | Nur Dev | Auch Produktion |
| Session Replay bei Errors | Nein | Ja (100% Errors) |
| Release-Tracking | Nein | Ja (aus package.json) |
| Fehler pro App-Version | Nicht möglich | Automatisch |
