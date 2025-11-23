interface ErrorContext {
  userId?: string;
  route?: string;
  action?: string;
  [key: string]: unknown;
}

interface ErrorEvent {
  timestamp: string;
  message: string;
  stack?: string;
  context?: ErrorContext;
  userAgent: string;
  url: string;
}

class ErrorTracker {
  private isProduction: boolean;
  private endpoint: string;

  constructor() {
    this.isProduction = import.meta.env.PROD;
    // In production, this would be your error tracking service endpoint
    this.endpoint = import.meta.env.VITE_ERROR_TRACKING_ENDPOINT || '';
  }

  captureError(error: Error, context?: ErrorContext): void {
    const errorEvent: ErrorEvent = {
      timestamp: new Date().toISOString(),
      message: error.message,
      stack: error.stack,
      context,
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    if (this.isProduction && this.endpoint) {
      // Send to error tracking service
      this.sendToService(errorEvent);
    } else {
      // Log to console in development
      console.error('Error tracked:', errorEvent);
    }
  }

  captureMessage(message: string, context?: ErrorContext): void {
    const errorEvent: ErrorEvent = {
      timestamp: new Date().toISOString(),
      message,
      context,
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    if (this.isProduction && this.endpoint) {
      this.sendToService(errorEvent);
    } else {
      console.warn('Message tracked:', errorEvent);
    }
  }

  private async sendToService(event: ErrorEvent): Promise<void> {
    try {
      await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.scrubSensitiveData(event)),
      });
    } catch (error) {
      // Fail silently - don't want error tracking to break the app
      console.error('Failed to send error to tracking service:', error);
    }
  }

  private scrubSensitiveData(event: ErrorEvent): ErrorEvent {
    // Remove sensitive data before sending
    const scrubbed = { ...event };
    
    if (scrubbed.context) {
      const { userId, ...safeContext } = scrubbed.context;
      scrubbed.context = safeContext;
    }

    // Scrub stack traces of local file paths
    if (scrubbed.stack) {
      scrubbed.stack = scrubbed.stack.replace(/file:\/\/\/.*?\//g, 'file:///');
    }

    return scrubbed;
  }

  setUser(userId: string): void {
    // Set user context for future errors
    if (this.isProduction) {
      sessionStorage.setItem('errorTracking.userId', userId);
    }
  }

  clearUser(): void {
    sessionStorage.removeItem('errorTracking.userId');
  }
}

export const errorTracker = new ErrorTracker();

// Setup global error handlers
export function initErrorTracking(): void {
  // Catch unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    errorTracker.captureError(
      new Error(event.reason?.message || 'Unhandled Promise Rejection'),
      { action: 'unhandledRejection' }
    );
  });

  // Catch global errors
  window.addEventListener('error', (event) => {
    errorTracker.captureError(event.error, { action: 'globalError' });
  });
}
