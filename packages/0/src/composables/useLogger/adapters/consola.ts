// Adapters
import { LoggerAdapter } from './adapter'

// Utilities
import { V0Error } from '#v0/utilities'

export class ConsolaLoggerAdapter extends LoggerAdapter {
  private consola: LoggerAdapter

  constructor (consolaInstance: LoggerAdapter | null | undefined) {
    super()
    if (!consolaInstance) {
      throw new V0Error('Consola instance is required for ConsolaLoggerAdapter', {
        code: 'V0_ADAPTER_INSTANCE_MISSING',
        adapter: 'ConsolaLoggerAdapter',
      })
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
