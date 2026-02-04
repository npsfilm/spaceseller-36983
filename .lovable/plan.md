
# Phase 19: Externe Monitoring-Dienste Integration

## Übersicht

Diese Phase verbindet die bereits implementierte Monitoring-Infrastruktur (Phase 17) mit externen Diensten für produktionsreife Observability.

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                    MONITORING ARCHITEKTUR                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  FRONTEND (Browser)                                                     │
│  └── src/lib/errorTracking.ts                                           │
│      ├── ErrorTracker Klasse (vorhanden)                                │
│      └── → Sentry SDK Integration (NEU)                                 │
│                                                                          │
│  BACKEND (Edge Functions)                                               │
│  └── supabase/functions/_shared/logger.ts                               │
│      ├── Logger Klasse (vorhanden)                                      │
│      ├── → HTTP Transport für Axiom/Datadog (NEU)                       │
│      └── → Webhook für kritische Fehler (NEU)                           │
│                                                                          │
│  BENÖTIGTE SECRETS:                                                     │
│  ├── VITE_SENTRY_DSN (Frontend - öffentlich)                            │
│  ├── LOGGING_ENDPOINT (Backend - Axiom/Datadog URL)                     │
│  ├── LOGGING_API_KEY (Backend - API Token)                              │
│  └── ALERT_WEBHOOK_URL (Backend - Slack/Discord/PagerDuty)              │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Teil 1: Sentry-Integration für das Frontend

### 1.1 Abhängigkeit hinzufügen

```bash
npm install @sentry/react
```

### 1.2 Refaktorierte `errorTracking.ts`

Die bestehende Klasse wird erweitert, um das Sentry SDK zu nutzen, während die Custom-Logik (Scrubbing, User-Context) erhalten bleibt:

```typescript
// src/lib/errorTracking.ts - REFAKTORIERT

import * as Sentry from '@sentry/react';

interface ErrorContext {
  userId?: string;
  route?: string;
  action?: string;
  [key: string]: unknown;
}

// Sensitive data patterns to scrub
const SENSITIVE_PATTERNS = [
  /password/i,
  /passwort/i,
  /token/i,
  /secret/i,
  /iban/i,
  /credit.?card/i,
  /kreditkarte/i,
];

class ErrorTracker {
  private isProduction: boolean;
  private isSentryEnabled: boolean;

  constructor() {
    this.isProduction = import.meta.env.PROD;
    this.isSentryEnabled = !!import.meta.env.VITE_SENTRY_DSN;
  }

  /**
   * Initialize Sentry SDK - called once in main.tsx
   */
  initialize(): void {
    if (!this.isSentryEnabled) {
      console.log('[ErrorTracker] Sentry not configured, using console logging');
      return;
    }

    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      environment: this.isProduction ? 'production' : 'development',
      
      // Only send 10% of transactions in production to save quota
      tracesSampleRate: this.isProduction ? 0.1 : 1.0,
      
      // Custom error filtering
      beforeSend: (event) => this.beforeSend(event),
      
      // Don't send PII
      sendDefaultPii: false,
      
      // Attach useful breadcrumbs
      integrations: [
        Sentry.breadcrumbsIntegration({
          console: true,
          dom: true,
          fetch: true,
          history: true,
        }),
      ],
    });
  }

  /**
   * beforeSend hook - scrub sensitive data before sending to Sentry
   */
  private beforeSend(event: Sentry.Event): Sentry.Event | null {
    // Scrub sensitive data from exception values
    if (event.exception?.values) {
      event.exception.values = event.exception.values.map((exception) => ({
        ...exception,
        value: this.scrubString(exception.value || ''),
      }));
    }

    // Scrub breadcrumb data
    if (event.breadcrumbs) {
      event.breadcrumbs = event.breadcrumbs.map((breadcrumb) => ({
        ...breadcrumb,
        data: this.scrubObject(breadcrumb.data),
      }));
    }

    // Scrub request body if present
    if (event.request?.data) {
      event.request.data = this.scrubString(
        typeof event.request.data === 'string' 
          ? event.request.data 
          : JSON.stringify(event.request.data)
      );
    }

    // Remove local file paths from stack traces
    if (event.exception?.values) {
      event.exception.values.forEach((exception) => {
        if (exception.stacktrace?.frames) {
          exception.stacktrace.frames = exception.stacktrace.frames.map((frame) => ({
            ...frame,
            filename: frame.filename?.replace(/file:\/\/\/.*?\//g, 'file:///'),
          }));
        }
      });
    }

    return event;
  }

  /**
   * Scrub sensitive patterns from string
   */
  private scrubString(str: string): string {
    let scrubbed = str;
    SENSITIVE_PATTERNS.forEach((pattern) => {
      scrubbed = scrubbed.replace(
        new RegExp(`(${pattern.source})[=:][^&\\s]+`, 'gi'),
        '$1=[REDACTED]'
      );
    });
    return scrubbed;
  }

  /**
   * Scrub sensitive keys from object
   */
  private scrubObject(obj: Record<string, unknown> | undefined): Record<string, unknown> | undefined {
    if (!obj) return obj;
    
    const scrubbed: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (SENSITIVE_PATTERNS.some((pattern) => pattern.test(key))) {
        scrubbed[key] = '[REDACTED]';
      } else if (typeof value === 'string') {
        scrubbed[key] = this.scrubString(value);
      } else {
        scrubbed[key] = value;
      }
    }
    return scrubbed;
  }

  /**
   * Capture an error with optional context
   */
  captureError(error: Error, context?: ErrorContext): void {
    if (this.isSentryEnabled) {
      Sentry.withScope((scope) => {
        if (context) {
          scope.setExtras(context);
          if (context.action) {
            scope.setTag('action', context.action);
          }
          if (context.route) {
            scope.setTag('route', context.route);
          }
        }
        Sentry.captureException(error);
      });
    } else {
      console.error('[ErrorTracker]', error, context);
    }
  }

  /**
   * Capture a message (warning/info level)
   */
  captureMessage(message: string, context?: ErrorContext): void {
    if (this.isSentryEnabled) {
      Sentry.withScope((scope) => {
        if (context) {
          scope.setExtras(context);
        }
        Sentry.captureMessage(message, 'warning');
      });
    } else {
      console.warn('[ErrorTracker]', message, context);
    }
  }

  /**
   * Set user context for future errors
   */
  setUser(userId: string, email?: string): void {
    if (this.isSentryEnabled) {
      Sentry.setUser({ 
        id: userId,
        // Only set email in non-production for debugging
        ...(this.isProduction ? {} : { email })
      });
    }
  }

  /**
   * Clear user context (on logout)
   */
  clearUser(): void {
    if (this.isSentryEnabled) {
      Sentry.setUser(null);
    }
  }

  /**
   * Add breadcrumb for better error context
   */
  addBreadcrumb(message: string, category: string, data?: Record<string, unknown>): void {
    if (this.isSentryEnabled) {
      Sentry.addBreadcrumb({
        message,
        category,
        data: this.scrubObject(data),
        level: 'info',
      });
    }
  }
}

export const errorTracker = new ErrorTracker();

/**
 * Initialize error tracking - called in main.tsx
 */
export function initErrorTracking(): void {
  // Initialize Sentry
  errorTracker.initialize();

  // Global error handlers
  window.addEventListener('unhandledrejection', (event) => {
    errorTracker.captureError(
      new Error(event.reason?.message || 'Unhandled Promise Rejection'),
      { action: 'unhandledRejection' }
    );
  });

  window.addEventListener('error', (event) => {
    if (event.error) {
      errorTracker.captureError(event.error, { action: 'globalError' });
    }
  });
}
```

### 1.3 AuthContext Integration

```typescript
// src/contexts/AuthContext.tsx - ERGÄNZUNG

import { errorTracker } from '@/lib/errorTracking';

// In useEffect nach Session-Initialisierung:
useEffect(() => {
  const unsubscribe = authService.onAuthStateChange((event, session) => {
    setSession(session);
    setUser(session?.user ?? null);
    setLoading(false);
    
    // Sentry User Context
    if (session?.user) {
      errorTracker.setUser(session.user.id, session.user.email);
    } else {
      errorTracker.clearUser();
    }
  });
  
  // ...
}, []);
```

---

## Teil 2: Erweitertes Backend-Logging

### 2.1 Refaktorierte Logger-Klasse

```typescript
// supabase/functions/_shared/logger.ts - ERWEITERT

interface LogContext {
  userId?: string;
  orderId?: string;
  ipAddress?: string;
  action: string;
  [key: string]: unknown;
}

interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'security';
  message: string;
  context?: LogContext;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
  // Zusätzliche Metadaten für externe Dienste
  service: string;
  environment: string;
}

interface LoggingConfig {
  endpoint?: string;
  apiKey?: string;
  webhookUrl?: string;
  service?: string;
}

export class Logger {
  private static config: LoggingConfig = {
    endpoint: Deno.env.get('LOGGING_ENDPOINT'),
    apiKey: Deno.env.get('LOGGING_API_KEY'),
    webhookUrl: Deno.env.get('ALERT_WEBHOOK_URL'),
    service: 'spaceseller-edge-functions',
  };

  private static environment = Deno.env.get('DENO_DEPLOYMENT_ID') ? 'production' : 'development';

  /**
   * Format log entry with all required fields
   */
  private static formatLog(
    level: LogEntry['level'], 
    message: string, 
    context?: LogContext, 
    error?: Error
  ): LogEntry {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      service: this.config.service || 'edge-functions',
      environment: this.environment,
    };

    if (context) {
      // Scrub sensitive data before logging
      entry.context = this.scrubContext(context);
    }

    if (error) {
      entry.error = {
        name: error.name,
        message: error.message,
        stack: this.scrubStack(error.stack),
      };
    }

    return entry;
  }

  /**
   * Scrub sensitive data from context
   */
  private static scrubContext(context: LogContext): LogContext {
    const scrubbed: LogContext = { action: context.action };
    const sensitiveKeys = ['password', 'token', 'secret', 'iban', 'apiKey'];
    
    for (const [key, value] of Object.entries(context)) {
      if (sensitiveKeys.some(s => key.toLowerCase().includes(s))) {
        scrubbed[key] = '[REDACTED]';
      } else {
        scrubbed[key] = value;
      }
    }
    
    return scrubbed;
  }

  /**
   * Scrub file paths from stack traces
   */
  private static scrubStack(stack?: string): string | undefined {
    if (!stack) return undefined;
    return stack.replace(/file:\/\/\/.*?\//g, 'file:///');
  }

  /**
   * Send log to console (always) and external service (if configured)
   */
  private static async log(entry: LogEntry): Promise<void> {
    // Always log to console (structured JSON)
    console.log(JSON.stringify(entry));

    // Send to external logging service if configured
    if (this.config.endpoint && this.config.apiKey) {
      this.sendToExternalService(entry).catch((err) => {
        console.error('Failed to send log to external service:', err.message);
      });
    }

    // Send critical alerts via webhook
    if (this.shouldAlert(entry.level)) {
      this.sendWebhookAlert(entry).catch((err) => {
        console.error('Failed to send webhook alert:', err.message);
      });
    }
  }

  /**
   * Send log entry to external service (Axiom, Datadog, etc.)
   */
  private static async sendToExternalService(entry: LogEntry): Promise<void> {
    if (!this.config.endpoint || !this.config.apiKey) return;

    // Axiom-compatible format (also works with Datadog HTTP logs)
    const payload = [{
      _time: entry.timestamp,
      level: entry.level,
      message: entry.message,
      service: entry.service,
      environment: entry.environment,
      ...entry.context,
      ...(entry.error ? { error: entry.error } : {}),
    }];

    await fetch(this.config.endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  }

  /**
   * Determine if log level should trigger an alert
   */
  private static shouldAlert(level: LogEntry['level']): boolean {
    return level === 'error' || level === 'security';
  }

  /**
   * Send webhook alert for critical logs
   */
  private static async sendWebhookAlert(entry: LogEntry): Promise<void> {
    if (!this.config.webhookUrl) return;

    // Slack-compatible webhook format
    const slackPayload = {
      text: `🚨 *${entry.level.toUpperCase()}* in ${entry.service}`,
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: entry.level === 'security' ? '🔐 Security Event' : '⚠️ Error Alert',
          },
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Message:*\n${entry.message}`,
            },
            {
              type: 'mrkdwn',
              text: `*Service:*\n${entry.service}`,
            },
            {
              type: 'mrkdwn',
              text: `*Environment:*\n${entry.environment}`,
            },
            {
              type: 'mrkdwn',
              text: `*Time:*\n${entry.timestamp}`,
            },
          ],
        },
        ...(entry.context?.action ? [{
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Action:* ${entry.context.action}`,
          },
        }] : []),
        ...(entry.error ? [{
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Error:*\n\`\`\`${entry.error.name}: ${entry.error.message}\`\`\``,
          },
        }] : []),
      ],
    };

    await fetch(this.config.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(slackPayload),
    });
  }

  // Public API (unverändert)
  static info(message: string, context?: LogContext): void {
    const entry = this.formatLog('info', message, context);
    this.log(entry);
  }

  static warn(message: string, context?: LogContext): void {
    const entry = this.formatLog('warn', message, context);
    this.log(entry);
  }

  static error(error: Error, context?: LogContext): void {
    const entry = this.formatLog('error', error.message, context, error);
    this.log(entry);
  }

  static security(event: string, context?: LogContext): void {
    const entry = this.formatLog('security', `Security Event: ${event}`, context);
    this.log(entry);
  }
}
```

---

## Teil 3: Webhook-Integration für kritische Fehler

### 3.1 Automatische Alerting-Logik

Die `shouldAlert()` und `sendWebhookAlert()` Methoden sind bereits im Logger integriert (siehe Teil 2). Diese werden automatisch aufgerufen bei:

- `Logger.error(...)` - Alle Fehler
- `Logger.security(...)` - Alle Sicherheitsereignisse

### 3.2 Verwendungsbeispiel in Edge Functions

```typescript
// Bestehende Edge Functions nutzen automatisch Webhooks:

// Bei Password Reset Anfragen (bereits implementiert)
Logger.security('Password reset requested', { 
  action: 'password_reset_request', 
  email, 
  ipAddress 
});
// → Sendet Slack-Nachricht an ALERT_WEBHOOK_URL

// Bei Fehlern
try {
  // ...
} catch (error) {
  Logger.error(error, { action: 'create_photographer_failed' });
  // → Sendet Slack-Nachricht mit Error-Details
}
```

### 3.3 Webhook-Format Kompatibilität

| Dienst | Format | Unterstützt |
|--------|--------|-------------|
| **Slack** | Blocks API | ✅ Native |
| **Discord** | Webhook | ✅ (nutzt Slack-kompatibles Fallback) |
| **Microsoft Teams** | Adaptive Cards | ⚙️ Erweiterbar |
| **PagerDuty** | Events API v2 | ⚙️ Erweiterbar |

---

## Benötigte Secrets

| Secret | Typ | Beschreibung | Beispiel |
|--------|-----|--------------|----------|
| `VITE_SENTRY_DSN` | Frontend (öffentlich) | Sentry Project DSN | `https://xxx@o123.ingest.sentry.io/456` |
| `LOGGING_ENDPOINT` | Backend | Axiom/Datadog Ingest URL | `https://api.axiom.co/v1/datasets/spaceseller/ingest` |
| `LOGGING_API_KEY` | Backend | API Token für Logging-Dienst | `xapt-xxx...` |
| `ALERT_WEBHOOK_URL` | Backend | Slack/Discord Webhook URL | `https://hooks.slack.com/services/xxx` |

---

## Zusammenfassung der Dateien

| Aktion | Datei | Beschreibung |
|--------|-------|--------------|
| **EDIT** | `src/lib/errorTracking.ts` | Sentry SDK Integration mit beforeSend Scrubbing |
| **EDIT** | `src/main.tsx` | Keine Änderung nötig (initErrorTracking bereits aufgerufen) |
| **EDIT** | `src/contexts/AuthContext.tsx` | User Context für Sentry setzen |
| **EDIT** | `supabase/functions/_shared/logger.ts` | HTTP Transport + Webhook Alerting |
| **INSTALL** | `package.json` | `@sentry/react` Dependency hinzufügen |

---

## Architektur nach Implementierung

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                    VOLLSTÄNDIGE MONITORING-ARCHITEKTUR                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  BENUTZER-BROWSER                                                       │
│  ├── React App mit @sentry/react                                        │
│  ├── errorTracker.captureError() → Sentry                               │
│  ├── errorTracker.setUser() → Sentry User Context                       │
│  └── Global Error Handlers → unhandledrejection, error                  │
│                                                                          │
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │
│                                                                          │
│  EDGE FUNCTIONS (Supabase/Deno)                                         │
│  └── Logger Klasse                                                      │
│      ├── Console → Immer (für Supabase Logs)                            │
│      ├── HTTP → Axiom/Datadog (wenn LOGGING_ENDPOINT gesetzt)           │
│      └── Webhook → Slack (bei error/security, wenn ALERT_WEBHOOK_URL)   │
│                                                                          │
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │
│                                                                          │
│  EXTERNE DIENSTE                                                        │
│  ├── Sentry → Frontend Errors, Performance, User Context                │
│  ├── Axiom/Datadog → Backend Logs, Structured Queries                   │
│  └── Slack → Real-time Alerts für kritische Ereignisse                  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Nächste Schritte nach Implementierung

1. **Secrets konfigurieren:**
   - `VITE_SENTRY_DSN` als öffentliche Umgebungsvariable
   - `LOGGING_ENDPOINT`, `LOGGING_API_KEY`, `ALERT_WEBHOOK_URL` als Supabase Secrets

2. **Sentry-Projekt erstellen:**
   - Neues Projekt auf sentry.io anlegen
   - DSN kopieren und als Secret speichern
   - Alert-Regeln konfigurieren

3. **Axiom/Datadog einrichten:**
   - Dataset/Index erstellen
   - API Token generieren
   - Ingest URL als Secret speichern

4. **Slack Webhook erstellen:**
   - Incoming Webhook in Slack-App konfigurieren
   - URL als Secret speichern
   - Test-Alert senden

5. **Testen:**
   - Frontend-Fehler auslösen und in Sentry prüfen
   - Logger.error() in Edge Function aufrufen und Webhook prüfen
   - User Context bei Login/Logout verifizieren
