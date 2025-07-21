// Types
import type { LoggerAdapter } from './adapter'

/**
 * Log4js logger adapter implementation
 *
 * This adapter integrates with the Log4js logging library,
 * providing Java-style logging patterns with categories,
 * appenders, and flexible configuration for Node.js applications.
 */
export class Log4jsLoggerAdapter implements LoggerAdapter {
  private log4js: any

  constructor (log4jsInstance: any) {
    if (!log4jsInstance) {
      throw new Error('Log4js instance is required for Log4jsLoggerAdapter')
    }
    this.log4js = log4jsInstance
  }

  debug (message: string, ...args: unknown[]) {
    this.log4js.debug(message, ...args)
  }

  info (message: string, ...args: unknown[]) {
    this.log4js.info(message, ...args)
  }

  warn (message: string, ...args: unknown[]) {
    this.log4js.warn(message, ...args)
  }

  error (message: string, ...args: unknown[]) {
    this.log4js.error(message, ...args)
  }

  trace (message: string, ...args: unknown[]) {
    this.log4js.trace(message, ...args)
  }

  fatal (message: string, ...args: unknown[]) {
    this.log4js.fatal(message, ...args)
  }
}
