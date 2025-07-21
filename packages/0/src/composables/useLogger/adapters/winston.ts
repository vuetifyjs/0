// Types
import type { LoggerAdapter } from './adapter'

/**
 * Winston logger adapter implementation
 *
 * This adapter integrates with the Winston logging library,
 * providing enterprise-grade logging with transports, formatting,
 * and advanced configuration options.
 */
export class WinstonLoggerAdapter implements LoggerAdapter {
  private winston: any

  constructor (winstonInstance: any) {
    if (!winstonInstance) {
      throw new Error('Winston instance is required for WinstonLoggerAdapter')
    }
    this.winston = winstonInstance
  }

  debug (message: string, ...args: unknown[]) {
    this.winston.debug(message, ...args)
  }

  info (message: string, ...args: unknown[]) {
    this.winston.info(message, ...args)
  }

  warn (message: string, ...args: unknown[]) {
    this.winston.warn(message, ...args)
  }

  error (message: string, ...args: unknown[]) {
    this.winston.error(message, ...args)
  }

  trace (message: string, ...args: unknown[]) {
    this.winston.verbose(message, ...args)
  }

  fatal (message: string, ...args: unknown[]) {
    this.winston.error('[FATAL]', message, ...args)
  }
}
