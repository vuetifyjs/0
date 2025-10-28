/**
 * @module useLogger
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-logger
 *
 * @remarks
 * Logging composable with adapter pattern supporting console, consola, and pino.
 *
 * Key features:
 * - Multiple log levels (trace, debug, info, warn, error, fatal)
 * - Adapter pattern for console/consola/pino integration
 * - Enable/disable logging
 * - Fallback logger for undefined loggers
 * - Context logging support
 *
 * Uses adapter pattern to abstract logging implementation.
 */
// Factories
import { createTrinity } from '#v0/composables/createTrinity'

// Composables
import { createContext, useContext } from '#v0/composables/createContext'
import { createPlugin } from '#v0/composables/createPlugin'

// Utilities
import { getCurrentInstance, shallowRef } from 'vue'

// Adapters
import { Vuetify0LoggerAdapter } from '#v0/composables/useLogger/adapters'

// Globals
import { __LOGGER_ENABLED__, IN_BROWSER } from '#v0/constants/globals'

// Types
import type { App } from 'vue'
import type { LoggerAdapter } from '#v0/composables/useLogger/adapters'
import type { LogLevel } from '#v0/composables/useLogger/types'
import type { ContextTrinity } from '#v0/composables/createTrinity'

// Exports
export type { LoggerAdapter } from '#v0/composables/useLogger/adapters'

export {
  ConsolaLoggerAdapter,
  PinoLoggerAdapter,
  Vuetify0LoggerAdapter,
} from '#v0/composables/useLogger/adapters'

export type { LogLevel } from '#v0/composables/useLogger/types'

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

export interface LoggerContextOptions extends LoggerOptions {
  namespace?: string
}

export interface LoggerPluginOptions extends LoggerContextOptions {}

/**
 * Creates a new logger instance.
 *
 * @param options The options for the logger instance.
 * @returns A new logger instance.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-logger
 *
 * @example
 * ```ts
 * import { createLogger } from '@vuetify/v0'
 *
 * const logger = createLogger({
 *   level: 'debug',
 *   prefix: '[MyApp]',
 * })
 *
 * logger.info('This is an info message')
 * logger.debug('This is a debug message')
 * logger.error('This is an error message')
 * logger.level('debug')
 * logger.debug('This debug message will now be logged')
 * ```
 */
export function createLogger<
  E extends LoggerContext = LoggerContext,
> (options: LoggerOptions = {}): E {
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
  } as E
}

function createFallbackLogger<
  E extends LoggerContext = LoggerContext,
> (namespace = 'v0:logger'): E {
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
  } as unknown as E
}

/**
 * Creates a new logger context.
 *
 * @param options The options for the logger context.
 * @template E The type of the logger context.
 * @returns A new logger context.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-logger
 *
 * @example
 * ```ts
 * import { createLoggerContext } from '@vuetify/v0'
 *
 * export const [useAppLogger, provideAppLogger, appLogger] = createLoggerContext({
 *   namespace: 'app:logger',
 *   level: 'debug',
 * })
 * ```
 */
export function createLoggerContext<
  E extends LoggerContext = LoggerContext,
> (_options: LoggerContextOptions = {}): ContextTrinity<E> {
  const { namespace = 'v0:logger', ...options } = _options
  const [useLoggerContext, _provideLoggerContext] = createContext<E>(namespace)
  const context = createLogger<E>(options)

  function provideLoggerContext (_context: E = context, app?: App): E {
    return _provideLoggerContext(_context, app)
  }

  return createTrinity<E>(useLoggerContext, provideLoggerContext, context)
}

/**
 * Creates a new logger plugin.
 *
 * @param options The options for the logger plugin.
 * @returns A new logger plugin.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-logger
 *
 * @example
 * ```ts
 * import { createApp } from 'vue'
 * import { createLoggerPlugin } from '@vuetify/v0'
 * import App from './App.vue'
 *
 * const logger = createLoggerPlugin({
 *   level: 'debug',
 *   prefix: '[MyApp]',
 * })
 *
 * const app = createApp(App)
 *
 * app.use(logger)
 *
 * app.mount('#app')
 * ```
 */
export function createLoggerPlugin<
  E extends LoggerContext = LoggerContext,
> (_options: LoggerPluginOptions = {}) {
  const { namespace = 'v0:logger', ...options } = _options
  const [, provideLoggerContext, context] = createLoggerContext<E>({ ...options, namespace })

  return createPlugin({
    namespace,
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

/**
 * Uses an existing or creates a new logger instance.
 *
 * @param namespace The namespace for the logger context. Defaults to `'v0:logger'`.
 * @returns The logger instance.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-logger
 *
 * @example
 * ```ts
 * import { useLogger } from '@vuetify/v0'
 *
 * const logger = useLogger()
 *
 * logger.info('This is an info message')
 * logger.debug('This is a debug message')
 * logger.error('This is an error message')
 * logger.level('debug')
 * logger.debug('This debug message will now be logged')
 * ```
 */
export function useLogger<
  E extends LoggerContext = LoggerContext,
> (namespace = 'v0:logger'): E {
  const fallback = createFallbackLogger<E>(namespace)

  if (!getCurrentInstance()) return fallback

  try {
    return useContext<E>(namespace, fallback)
  } catch {
    return fallback
  }
}
