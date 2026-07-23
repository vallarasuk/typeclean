export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'silent';

export interface LoggerOptions {
  level?: LogLevel;
  prefix?: string;
  timestamp?: boolean;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  silent: 4,
};

export class Logger {
  private level: number;
  private prefix: string;
  private timestamp: boolean;

  constructor(options: LoggerOptions = {}) {
    this.level = LOG_LEVELS[options.level || 'info'];
    this.prefix = options.prefix || '';
    this.timestamp = options.timestamp ?? false;
  }

  private formatMessage(message: any, args: any[]): any[] {
    const parts = [];
    if (this.timestamp) {
      parts.push(`[${new Date().toISOString()}]`);
    }
    if (this.prefix) {
      parts.push(`[${this.prefix}]`);
    }
    parts.push(message);
    return [...parts, ...args];
  }

  debug(message: any, ...args: any[]) {
    if (this.level <= LOG_LEVELS.debug) {
      console.debug(...this.formatMessage(message, args));
    }
  }

  info(message: any, ...args: any[]) {
    if (this.level <= LOG_LEVELS.info) {
      console.info(...this.formatMessage(message, args));
    }
  }

  warn(message: any, ...args: any[]) {
    if (this.level <= LOG_LEVELS.warn) {
      console.warn(...this.formatMessage(message, args));
    }
  }

  error(message: any, ...args: any[]) {
    if (this.level <= LOG_LEVELS.error) {
      console.error(...this.formatMessage(message, args));
    }
  }
}

export function createLogger(options?: LoggerOptions): Logger {
  return new Logger(options);
}
