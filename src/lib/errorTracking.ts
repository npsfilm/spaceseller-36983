import * as Sentry from '@sentry/react';

interface ErrorContext {
  userId?: string;
  route?: string;
  action?: string;
  [key: string]: unknown;
}

// Sensitive data patterns to scrub before sending to external services
const SENSITIVE_PATTERNS = [
  /password/i,
  /passwort/i,
  /token/i,
  /secret/i,
  /iban/i,
  /bic/i,
  /credit.?card/i,
  /kreditkarte/i,
  /api.?key/i,
  /auth/i,
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
      
      // Custom error filtering and scrubbing
      beforeSend: (event) => this.beforeSend(event),
      
      // Don't send PII automatically
      sendDefaultPii: false,
      
      // Attach useful breadcrumbs for debugging
      integrations: [
        Sentry.breadcrumbsIntegration({
          console: true,
          dom: true,
          fetch: true,
          history: true,
        }),
      ],
      
      // Ignore common non-actionable errors
      ignoreErrors: [
        'ResizeObserver loop limit exceeded',
        'ResizeObserver loop completed with undelivered notifications',
        'Non-Error promise rejection captured',
      ],
    });

    console.log('[ErrorTracker] Sentry initialized');
  }

  /**
   * beforeSend hook - scrub sensitive data before sending to Sentry
   */
  private beforeSend(event: Sentry.ErrorEvent): Sentry.ErrorEvent | null {
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
        data: this.scrubObject(breadcrumb.data as Record<string, unknown> | undefined),
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
      // Match patterns like "password=value" or "password: value"
      scrubbed = scrubbed.replace(
        new RegExp(`(${pattern.source})[=:]["']?[^&\\s"']+["']?`, 'gi'),
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
      } else if (typeof value === 'object' && value !== null) {
        scrubbed[key] = this.scrubObject(value as Record<string, unknown>);
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
          // Scrub context before setting extras
          scope.setExtras(this.scrubObject(context) || {});
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
      // Fallback to console logging in development or when Sentry is not configured
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
          scope.setExtras(this.scrubObject(context) || {});
        }
        Sentry.captureMessage(message, 'warning');
      });
    } else {
      console.warn('[ErrorTracker]', message, context);
    }
  }

  /**
   * Set user context for future errors
   * Note: Only userId is sent in production for privacy
   */
  setUser(userId: string, email?: string): void {
    if (this.isSentryEnabled) {
      Sentry.setUser({ 
        id: userId,
        // Only include email in non-production for debugging
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

  /**
   * Start a performance transaction
   */
  startTransaction(name: string, op: string): void {
    if (this.isSentryEnabled) {
      Sentry.startInactiveSpan({ name, op });
    }
  }
}

export const errorTracker = new ErrorTracker();

/**
 * Initialize error tracking - called in main.tsx
 */
export function initErrorTracking(): void {
  // Initialize Sentry SDK
  errorTracker.initialize();

  // Global error handlers for uncaught errors
  window.addEventListener('unhandledrejection', (event) => {
    errorTracker.captureError(
      new Error(event.reason?.message || String(event.reason) || 'Unhandled Promise Rejection'),
      { action: 'unhandledRejection' }
    );
  });

  window.addEventListener('error', (event) => {
    if (event.error) {
      errorTracker.captureError(event.error, { action: 'globalError' });
    }
  });
}
