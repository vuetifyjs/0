// Globals
import { IN_BROWSER } from '#v0/constants/globals'

// Utilities
import { isFunction } from '#v0/utilities'

// Types
import type { LogLevel } from '../types'
import type { LoggerAdapter } from './adapter'

/**
 * Vuetify0.x logger adapter implementation
 *
 * This adapter provides console-based logging with proper formatting,
 * color coding, timestamps, and log level filtering for development
 * and production environments.
 */
export class Vuetify0LoggerAdapter implements LoggerAdapter {
  private prefix: string
  private colors: boolean
  private timestamps: boolean

  constructor (options: {
    prefix?: string
    colors?: boolean
    timestamps?: boolean
  } = {}) {
    this.prefix = options.prefix || 'v0'
    this.colors = options.colors !== false
    this.timestamps = options.timestamps !== false
  }

  debug (message: string, ...args: unknown[]) {
    this.log('debug', 'debug', message, ...args)
  }

  info (message: string, ...args: unknown[]) {
    this.log('info', 'info', message, ...args)
  }

  warn (message: string, ...args: unknown[]) {
    this.log('warn', 'warn', message, ...args)
  }

  error (message: string, ...args: unknown[]) {
    this.log('error', 'error', message, ...args)
  }

  trace (message: string, ...args: unknown[]) {
    this.log('trace', 'trace', message, ...args)
  }

  fatal (message: string, ...args: unknown[]) {
    this.log('fatal', 'error', message, ...args)
  }

  private format (level: LogLevel, message: string, ...args: unknown[]): [string, ...unknown[]] {
    const timestamp = this.timestamps ? this.timestamp() : ''
    const prefixTag = `[${this.prefix} ${level.toLowerCase()}]`

    const formattedMessage = [timestamp, prefixTag, message]
      .filter(Boolean)
      .join(' ')

    return [formattedMessage, ...args]
  }

  private timestamp (): string {
    if (!IN_BROWSER) return new Date().toISOString()

    const now = new Date()

    /* v8 ignore next -- defensive fallback, toTimeString always returns valid format */
    return now.toTimeString().split(' ')[0] ?? ''
  }

  private style (level: LogLevel): string {
    if (!this.colors || !IN_BROWSER) return ''

    const styles: Record<LogLevel, string> = {
      trace: 'color: #64748b',
      debug: 'color: #3b82f6',
      info: 'color: #10b981',
      warn: 'color: #f59e0b',
      error: 'color: #ef4444',
      fatal: 'color: #dc2626; font-weight: bold',
      silent: '',
    }

    /* v8 ignore next -- LogLevel union is exhaustive */
    return styles[level] || ''
  }

  private log (level: LogLevel, method: keyof Console, message: string, ...args: unknown[]) {
    const [formattedMessage, ...restArgs] = this.format(level, message, ...args)
    const style = this.style(level)

    if (IN_BROWSER && style && isFunction(console[method])) {
      ;(console[method] as any)(`%c${formattedMessage}`, style, ...restArgs)
    } else if (isFunction(console[method])) {
      ;(console[method] as any)(formattedMessage, ...restArgs)
    }
  }
}
