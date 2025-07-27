// Composables
import { createContext } from '#v0/factories/createContext'
import { createPlugin } from '#v0/factories/createPlugin'

// Utilities
import { getCurrentInstance, shallowRef } from 'vue'

// Adapters
import { Vuetify0LoggerAdapter } from './adapters'

// Globals
import { __LOGGER_ENABLED__, IN_BROWSER } from '#v0/constants/globals'

// Types
import type { App } from 'vue'
import type { LoggerAdapter } from './adapters'
import type { LogLevel } from './types'

export type { LoggerAdapter } from './adapters'

export {
  ConsolaLoggerAdapter,
  PinoLoggerAdapter,
  Vuetify0LoggerAdapter,
} from './adapters'

export type { LogLevel } from './types'

export interface LoggerContext {
  debug: (message: string, ...args: unknown[]) => void
  info: (message: string, ...args: unknown[]) => void
  warn: (message: string, ...args: unknown[]) => void
  error: (message: string, ...args: unknown[]) => void
  trace: (message: string, ...args: unknown[]) => void
  fatal: (message: string, ...args: unknown[]) => void
  level: (level: LogLevel) => void
  current: () => LogLevel
  enabled: () => boolean
  enable: () => void
  disable: () => void
}

export interface LoggerOptions {
  adapter?: LoggerAdapter
  level?: LogLevel
  prefix?: string
  enabled?: boolean
}

export interface LoggerPlugin {
  install: (app: App, ...options: any[]) => any
}

const [useLoggerContext, provideLoggerContext] = createContext<LoggerContext>('v0:logger')

/**
 * Creates a logger context for application logging with configurable adapters and levels.
 * This function provides a consistent logging interface that can be configured with
 * different adapters and optimized for production builds with conditional compilation.
 *
 * @param options Configuration for the logger adapter, level, and behavior.
 * @returns A logger context object with logging methods and controls.
 */
export function createLogger (options: LoggerOptions = {}): LoggerContext {
  const {
    adapter = new Vuetify0LoggerAdapter({ prefix: options.prefix }),
    level: initialLevel = 'info',
    enabled: initialEnabled = __LOGGER_ENABLED__,
  } = options

  const currentLevel = shallowRef(initialLevel)
  const isEnabled = shallowRef(initialEnabled)

  function value (level: LogLevel): number {
    const levels: Record<LogLevel, number> = {
      trace: 0,
      debug: 1,
      info: 2,
      warn: 3,
      error: 4,
      fatal: 5,
      silent: 6,
    }
    return levels[level] ?? 2
  }

  function can (level: LogLevel): boolean {
    if (!isEnabled.value) return false
    return value(level) >= value(currentLevel.value)
  }

  function format (message: string): string {
    return message
  }

  function debug (message: string, ...args: unknown[]) {
    if (can('debug')) adapter.debug(format(message), ...args)
  }

  function info (message: string, ...args: unknown[]) {
    if (can('info')) adapter.info(format(message), ...args)
  }

  function warn (message: string, ...args: unknown[]) {
    if (can('warn')) adapter.warn(format(message), ...args)
  }

  function error (message: string, ...args: unknown[]) {
    if (can('error')) adapter.error(format(message), ...args)
  }

  function trace (message: string, ...args: unknown[]) {
    if (can('trace')) adapter.trace?.(format(message), ...args)
  }

  function fatal (message: string, ...args: unknown[]) {
    if (can('fatal')) adapter.fatal?.(format(message), ...args)
  }

  function level (newLevel: LogLevel) {
    currentLevel.value = newLevel
  }

  function current () {
    return currentLevel.value
  }

  function enabled () {
    return isEnabled.value
  }

  function enable () {
    isEnabled.value = true
  }

  function disable () {
    isEnabled.value = false
  }

  return {
    debug,
    info,
    warn,
    error,
    trace,
    fatal,
    level,
    current,
    enabled,
    enable,
    disable,
  }
}

function createFallbackLogger (namespace = 'v0:logger'): LoggerContext {
  function format (message: string, type: string): string {
    return `[${namespace} ${type}] ${message}`
  }

  return {
    debug: (message: string, ...args: unknown[]) => console.log(format(message, 'debug'), ...args),
    info: (message: string, ...args: unknown[]) => console.log(format(message, 'info'), ...args),
    warn: (message: string, ...args: unknown[]) => console.log(format(message, 'warn'), ...args),
    error: (message: string, ...args: unknown[]) => console.log(format(message, 'error'), ...args),
    trace: (message: string, ...args: unknown[]) => console.log(format(message, 'trace'), ...args),
    fatal: (message: string, ...args: unknown[]) => console.log(format(message, 'fatal'), ...args),
    level: () => {},
    current: () => 'info' as LogLevel,
    enabled: () => true,
    enable: () => {},
    disable: () => {},
  }
}

export function useLogger (namespace?: string): LoggerContext {
  if (getCurrentInstance()) {
    try {
      return useLoggerContext(namespace)
    } catch (error) {
      if (__DEV__ && IN_BROWSER && namespace) console.warn(error)
    }
  }

  return createFallbackLogger(namespace)
}

export function createLoggerPlugin (options: LoggerOptions = {}): LoggerPlugin {
  const context = createLogger(options)

  return createPlugin<LoggerPlugin>({
    namespace: 'v0:logger',
    provide: (app: App) => {
      provideLoggerContext(context, app)
    },
    setup: (_app: App) => {
      if (__DEV__ && IN_BROWSER) {
        ;(window as any).__v0Logger__ = context
      }
    },
  })
}
