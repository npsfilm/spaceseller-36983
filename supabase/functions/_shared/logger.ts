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
}

export class Logger {
  private static formatLog(level: LogEntry['level'], message: string, context?: LogContext, error?: Error): LogEntry {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
    };

    if (context) {
      entry.context = context;
    }

    if (error) {
      entry.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
    }

    return entry;
  }

  private static log(entry: LogEntry): void {
    // In production, this would send to external logging service (Axiom, LogDNA, etc.)
    // For now, we use structured console logging
    console.log(JSON.stringify(entry));
  }

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
