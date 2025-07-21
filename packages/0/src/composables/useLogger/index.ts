// Composables
import { createContext } from '#v0/factories/createContext'
import { createPlugin } from '#v0/factories/createPlugin'

// Utilities
import { ref } from 'vue'

// Adapters
import { Vuetify0LoggerAdapter } from './adapters'

// Globals
import { __DEV__, __LOGGER_ENABLED__, IN_BROWSER } from '#v0/constants/globals'

// Types
import type { App } from 'vue'
import type { LoggerAdapter } from './adapters'
import type { LogLevel } from './types'

export type { LoggerAdapter } from './adapters'

export {
  Log4jsLoggerAdapter,
  PinoLoggerAdapter,
  Vuetify0LoggerAdapter,
  WinstonLoggerAdapter,
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
  stripInProduction?: boolean
}

export interface LoggerPlugin {
  install: (app: App, ...options: any[]) => any
}

export const [useLoggerContext, provideLoggerContext] = createContext<LoggerContext>('v0:logger')

/**
 * Creates a logger context for managing application logging.
 * This function provides a consistent logging interface that can be
 * configured with different adapters and optimized for production builds.
 *
 * @param options Configuration for the logger adapter, level, and behavior.
 * @returns A logger context object with logging methods and controls.
 */
export function createLogger (options: LoggerOptions = {}): LoggerContext {
  const {
    adapter = new Vuetify0LoggerAdapter({ prefix: options.prefix }),
    level: initialLevel = 'info',
    enabled: initialEnabled = __LOGGER_ENABLED__,
    stripInProduction = true,
  } = options

  const currentLevel = ref(initialLevel)
  const isEnabled = ref(initialEnabled)

  // In production with stripInProduction=true, return no-op functions
  if (!__DEV__ && stripInProduction) {
    const noop = () => {}
    return {
      debug: noop,
      info: noop,
      warn: noop,
      error: noop,
      trace: noop,
      fatal: noop,
      level: noop,
      current: () => 'silent' as LogLevel,
      enabled: () => false,
      enable: noop,
      disable: noop,
    }
  }

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

  function should (level: LogLevel): boolean {
    if (!isEnabled.value) return false
    return value(level) >= value(currentLevel.value)
  }

  function debug (message: string, ...args: unknown[]) {
    if (should('debug')) adapter.debug(message, ...args)
  }

  function info (message: string, ...args: unknown[]) {
    if (should('info')) adapter.info(message, ...args)
  }

  function warn (message: string, ...args: unknown[]) {
    if (should('warn')) adapter.warn(message, ...args)
  }

  function error (message: string, ...args: unknown[]) {
    if (should('error')) adapter.error(message, ...args)
  }

  function trace (message: string, ...args: unknown[]) {
    if (should('trace')) adapter.trace?.(message, ...args)
  }

  function fatal (message: string, ...args: unknown[]) {
    if (should('fatal')) adapter.fatal?.(message, ...args)
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

/**
 * Simple hook to access the logger context.
 *
 * @returns The logger context containing logging methods and controls.
 */
export function useLogger (): LoggerContext {
  return useLoggerContext()
}

/**
 * Creates a Vue plugin for providing application logging capabilities.
 * Uses the universal plugin factory to eliminate boilerplate code.
 * This plugin automatically provides the logger context and can add
 * development helpers when in development mode.
 *
 * @param options Configuration for the logger system.
 * @returns A Vue plugin object with install method.
 */
export function createLoggerPlugin (options: LoggerOptions = {}): LoggerPlugin {
  const context = createLogger({
    stripInProduction: true,
    ...options,
  })

  return createPlugin<LoggerPlugin>({
    namespace: 'v0:logger',
    provide: (app: App) => {
      provideLoggerContext(context, app)
    },
    setup: (_app: App) => {
      if (__DEV__ && IN_BROWSER) {
        // Add global logger for debugging
        ;(window as any).__v0Logger__ = context
      }
    },
  })
}
