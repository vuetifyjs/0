// Globals
import { IN_BROWSER } from '#v0/constants/globals'

// Types
import type { LoggerAdapter } from './adapter'
import type { LogLevel } from '../types'

/**
 * Vuetify 0.x logger adapter implementation
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
    const levelTag = `[${level.toUpperCase()}]`
    const prefixTag = `[${this.prefix}]`

    const formattedMessage = [timestamp, prefixTag, levelTag, message]
      .filter(Boolean)
      .join(' ')

    return [formattedMessage, ...args]
  }

  private timestamp (): string {
    if (!IN_BROWSER) return new Date().toISOString()

    const now = new Date()
    return now.toTimeString().split(' ')[0]
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

    return styles[level] || ''
  }

  private log (level: LogLevel, method: keyof Console, message: string, ...args: unknown[]) {
    const [formattedMessage, ...restArgs] = this.format(level, message, ...args)
    const style = this.style(level)

    if (IN_BROWSER && style && typeof console[method] === 'function') {
      ;(console[method] as any)(`%c${formattedMessage}`, style, ...restArgs)
    } else if (typeof console[method] === 'function') {
      ;(console[method] as any)(formattedMessage, ...restArgs)
    }
  }
}
