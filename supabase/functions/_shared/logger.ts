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
  service: string;
  environment: string;
}

interface LoggingConfig {
  endpoint?: string;
  apiKey?: string;
  webhookUrl?: string;
  service: string;
}

// Sensitive keys that should be redacted in logs
const SENSITIVE_KEYS = ['password', 'passwort', 'token', 'secret', 'iban', 'bic', 'apikey', 'api_key', 'authorization'];

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
      service: this.config.service,
      environment: this.environment,
    };

    if (context) {
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
   * Scrub sensitive data from context object
   */
  private static scrubContext(context: LogContext): LogContext {
    const scrubbed: LogContext = { action: context.action };
    
    for (const [key, value] of Object.entries(context)) {
      const keyLower = key.toLowerCase();
      if (SENSITIVE_KEYS.some(s => keyLower.includes(s))) {
        scrubbed[key] = '[REDACTED]';
      } else if (typeof value === 'string' && value.length > 500) {
        // Truncate very long strings
        scrubbed[key] = value.substring(0, 500) + '...[truncated]';
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
    // Always log to console as structured JSON (picked up by Supabase logs)
    console.log(JSON.stringify(entry));

    // Send to external logging service if configured (Axiom, Datadog, etc.)
    if (this.config.endpoint && this.config.apiKey) {
      this.sendToExternalService(entry).catch((err) => {
        console.error(JSON.stringify({
          timestamp: new Date().toISOString(),
          level: 'error',
          message: 'Failed to send log to external service',
          error: { name: 'LoggingError', message: err.message },
          service: this.config.service,
          environment: this.environment,
        }));
      });
    }

    // Send critical alerts via webhook (Slack, Discord, etc.)
    if (this.shouldAlert(entry.level)) {
      this.sendWebhookAlert(entry).catch((err) => {
        console.error(JSON.stringify({
          timestamp: new Date().toISOString(),
          level: 'error',
          message: 'Failed to send webhook alert',
          error: { name: 'WebhookError', message: err.message },
          service: this.config.service,
          environment: this.environment,
        }));
      });
    }
  }

  /**
   * Send log entry to external service (Axiom, Datadog HTTP logs, etc.)
   */
  private static async sendToExternalService(entry: LogEntry): Promise<void> {
    if (!this.config.endpoint || !this.config.apiKey) return;

    // Axiom-compatible format (also works with Datadog HTTP logs API)
    const payload = [{
      _time: entry.timestamp,
      level: entry.level,
      message: entry.message,
      service: entry.service,
      environment: entry.environment,
      ...entry.context,
      ...(entry.error ? { error: entry.error } : {}),
    }];

    const response = await fetch(this.config.endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`External logging failed: ${response.status} ${response.statusText}`);
    }
  }

  /**
   * Determine if log level should trigger an immediate alert
   */
  private static shouldAlert(level: LogEntry['level']): boolean {
    return level === 'error' || level === 'security';
  }

  /**
   * Send webhook alert for critical logs (Slack, Discord, etc.)
   */
  private static async sendWebhookAlert(entry: LogEntry): Promise<void> {
    if (!this.config.webhookUrl) return;

    // Slack Block Kit format (also compatible with Discord webhooks)
    const slackPayload = {
      text: `🚨 *${entry.level.toUpperCase()}* in ${entry.service}`,
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: entry.level === 'security' ? '🔐 Security Event' : '⚠️ Error Alert',
            emoji: true,
          },
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Message:*\n${entry.message.substring(0, 200)}${entry.message.length > 200 ? '...' : ''}`,
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
            text: `*Action:* \`${entry.context.action}\``,
          },
        }] : []),
        ...(entry.context?.userId ? [{
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*User ID:* \`${entry.context.userId}\``,
          },
        }] : []),
        ...(entry.error ? [{
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Error:*\n\`\`\`${entry.error.name}: ${entry.error.message}\`\`\``,
          },
        }] : []),
        {
          type: 'divider',
        },
      ],
    };

    const response = await fetch(this.config.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(slackPayload),
    });

    if (!response.ok) {
      throw new Error(`Webhook alert failed: ${response.status} ${response.statusText}`);
    }
  }

  // ============================================
  // PUBLIC API
  // ============================================

  /**
   * Log an informational message
   */
  static info(message: string, context?: LogContext): void {
    const entry = this.formatLog('info', message, context);
    this.log(entry);
  }

  /**
   * Log a warning message
   */
  static warn(message: string, context?: LogContext): void {
    const entry = this.formatLog('warn', message, context);
    this.log(entry);
  }

  /**
   * Log an error with full stack trace
   * Note: Automatically triggers webhook alert if configured
   */
  static error(error: Error, context?: LogContext): void {
    const entry = this.formatLog('error', error.message, context, error);
    this.log(entry);
  }

  /**
   * Log a security-relevant event
   * Note: Automatically triggers webhook alert if configured
   */
  static security(event: string, context?: LogContext): void {
    const entry = this.formatLog('security', `Security Event: ${event}`, context);
    this.log(entry);
  }
}
