// Types
import type { LoggerAdapter } from './adapter'

export class ConsolaLoggerAdapter implements LoggerAdapter {
  private consola: any

  constructor (consolaInstance: any) {
    if (!consolaInstance) {
      throw new Error('Consola instance is required for ConsolaLoggerAdapter')
    }
    this.consola = consolaInstance
  }

  debug (message: string, ...args: unknown[]) {
    this.consola.debug(message, ...args)
  }

  info (message: string, ...args: unknown[]) {
    this.consola.info(message, ...args)
  }

  warn (message: string, ...args: unknown[]) {
    this.consola.warn(message, ...args)
  }

  error (message: string, ...args: unknown[]) {
    this.consola.error(message, ...args)
  }

  trace (message: string, ...args: unknown[]) {
    if (this.consola.trace) {
      this.consola.trace(message, ...args)
    } else {
      this.consola.debug(message, ...args)
    }
  }

  fatal (message: string, ...args: unknown[]) {
    if (this.consola.fatal) {
      this.consola.fatal(message, ...args)
    } else {
      this.consola.error('[FATAL]', message, ...args)
    }
  }
}
