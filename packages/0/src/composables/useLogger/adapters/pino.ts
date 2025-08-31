// Types
import type { LoggerAdapter } from './adapter'

/**
 * Pino logger adapter implementation
 *
 * This adapter integrates with the Pino logging library,
 * providing high-performance structured logging optimized
 * for Node.js applications with minimal overhead.
 */
export class PinoLoggerAdapter implements LoggerAdapter {
  private pino: any

  constructor (pinoInstance: any) {
    if (!pinoInstance) {
      throw new Error('Pino instance is required for PinoLoggerAdapter')
    }
    this.pino = pinoInstance
  }

  debug (message: string, ...args: unknown[]) {
    this.pino.debug(this.format(message, ...args))
  }

  info (message: string, ...args: unknown[]) {
    this.pino.info(this.format(message, ...args))
  }

  warn (message: string, ...args: unknown[]) {
    this.pino.warn(this.format(message, ...args))
  }

  error (message: string, ...args: unknown[]) {
    this.pino.error(this.format(message, ...args))
  }

  trace (message: string, ...args: unknown[]) {
    this.pino.trace(this.format(message, ...args))
  }

  fatal (message: string, ...args: unknown[]) {
    this.pino.fatal(this.format(message, ...args))
  }

  private format (message: string, ...args: unknown[]): any {
    if (args.length === 0) {
      return { msg: message }
    }

    // If first arg is an object, use it as metadata
    if (args.length === 1 && typeof args[0] === 'object' && args[0] !== null) {
      return { ...args[0], msg: message }
    }

    // Otherwise, include args in metadata
    return { msg: message, args }
  }
}
