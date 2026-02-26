import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Utilities
import { createApp, defineComponent } from 'vue'

import { createLogger, createLoggerContext, createLoggerPlugin, useLogger } from './index'

describe('useLogger', () => {
  beforeEach(() => {
    vi.spyOn(console, 'debug').mockImplementation(() => {})
    vi.spyOn(console, 'info').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(console, 'trace').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('createLogger', () => {
    it('should create a logger with default options', () => {
      const logger = createLogger()

      expect(logger).toBeDefined()
      expect(typeof logger.debug).toBe('function')
      expect(typeof logger.info).toBe('function')
      expect(typeof logger.warn).toBe('function')
      expect(typeof logger.error).toBe('function')
      expect(typeof logger.trace).toBe('function')
      expect(typeof logger.fatal).toBe('function')
    })

    it('should default to info log level', () => {
      const logger = createLogger()

      expect(logger.current()).toBe('info')
    })

    it('should respect log levels', () => {
      const logger = createLogger({ level: 'warn' })

      logger.debug('debug message')
      logger.info('info message')
      logger.warn('warn message')
      logger.error('error message')

      expect(console.debug).not.toHaveBeenCalled()
      expect(console.info).not.toHaveBeenCalled()
      expect(console.warn).toHaveBeenCalled()
      expect(console.error).toHaveBeenCalled()
    })

    it('should allow changing log level dynamically', () => {
      const logger = createLogger({ level: 'error' })

      logger.info('info message')
      expect(console.info).not.toHaveBeenCalled()

      logger.level('info')
      logger.info('info message')
      expect(console.info).toHaveBeenCalled()
    })

    it('should allow enabling/disabling logger', () => {
      const logger = createLogger()

      logger.disable()
      logger.info('info message')
      expect(console.info).not.toHaveBeenCalled()

      logger.enable()
      logger.info('info message')
      expect(console.info).toHaveBeenCalled()
    })

    it('should return current log level', () => {
      const logger = createLogger({ level: 'debug' })

      expect(logger.current()).toBe('debug')

      logger.level('warn')
      expect(logger.current()).toBe('warn')
    })

    it('should return enabled status', () => {
      const logger = createLogger()

      expect(logger.enabled()).toBe(true)

      logger.disable()
      expect(logger.enabled()).toBe(false)

      logger.enable()
      expect(logger.enabled()).toBe(true)
    })
  })

  describe('createLoggerPlugin', () => {
    it('should create a Vue plugin', () => {
      const plugin = createLoggerPlugin()

      expect(plugin).toBeDefined()
      expect(typeof plugin.install).toBe('function')
    })

    it('should accept logger options', () => {
      const plugin = createLoggerPlugin({
        level: 'error',
        prefix: 'app',
      })

      expect(plugin).toBeDefined()
      expect(typeof plugin.install).toBe('function')
    })
  })

  describe('log level hierarchy', () => {
    it('should respect log level hierarchy correctly', () => {
      const logger = createLogger({ level: 'warn' })

      logger.trace('trace')
      logger.debug('debug')
      logger.info('info')

      logger.warn('warn')
      logger.error('error')
      logger.fatal('fatal')

      expect(console.trace).not.toHaveBeenCalled()
      expect(console.debug).not.toHaveBeenCalled()
      expect(console.info).not.toHaveBeenCalled()
      expect(console.warn).toHaveBeenCalled()
      expect(console.error).toHaveBeenCalledTimes(2)
    })

    it('should handle silent level', () => {
      const logger = createLogger({ level: 'silent' })

      logger.trace('trace')
      logger.debug('debug')
      logger.info('info')
      logger.warn('warn')
      logger.error('error')
      logger.fatal('fatal')

      expect(console.trace).not.toHaveBeenCalled()
      expect(console.debug).not.toHaveBeenCalled()
      expect(console.info).not.toHaveBeenCalled()
      expect(console.warn).not.toHaveBeenCalled()
      expect(console.error).not.toHaveBeenCalled()
    })
  })

  describe('createLoggerContext', () => {
    it('should create context with default namespace', () => {
      const [useCtx, provideCtx, defaultCtx] = createLoggerContext()

      expect(useCtx).toBeTypeOf('function')
      expect(provideCtx).toBeTypeOf('function')
      expect(defaultCtx).toBeDefined()
      expect(defaultCtx.info).toBeTypeOf('function')
    })

    it('should create context with custom namespace', () => {
      const [, , context] = createLoggerContext({ namespace: 'custom:logger' })

      expect(context).toBeDefined()
      expect(context.debug).toBeTypeOf('function')
    })

    it('should create context with logger options', () => {
      const [, , context] = createLoggerContext({ level: 'error' })

      expect(context.current()).toBe('error')
    })

    it('should allow providing context to app', () => {
      const [, provideCtx, ctx] = createLoggerContext()
      const app = createApp({ template: '<div />' })

      const result = provideCtx(ctx, app)

      expect(result).toBe(ctx)
    })
  })

  describe('createLoggerPlugin extended', () => {
    it('should install and provide context to app', () => {
      const plugin = createLoggerPlugin({ level: 'debug' })
      const app = createApp({ template: '<div />' })

      app.use(plugin)

      expect(plugin).toBeDefined()
    })

    it('should expose logger on window in dev mode', () => {
      const originalDev = (globalThis as unknown as Record<string, unknown>).__DEV__
      ;(globalThis as unknown as Record<string, unknown>).__DEV__ = true

      const plugin = createLoggerPlugin()
      const app = createApp({ template: '<div />' })

      app.use(plugin)

      expect((window as unknown as Record<string, unknown>).__v0Logger__).toBeDefined()

      ;(globalThis as unknown as Record<string, unknown>).__DEV__ = originalDev
    })
  })

  describe('useLogger consumer', () => {
    it('should return fallback logger when called outside component', () => {
      const logger = useLogger()

      expect(logger).toBeDefined()
      expect(logger.info).toBeTypeOf('function')
      expect(logger.debug).toBeTypeOf('function')
      expect(logger.error).toBeTypeOf('function')
    })

    it('should return fallback logger with custom namespace', () => {
      const logger = useLogger('my:logger')

      logger.info('test message')

      expect(console.info).toHaveBeenCalledWith(
        expect.stringContaining('[my:logger info]'),
      )
    })

    it('should use provided context when in component', () => {
      const [useAppLogger, provideAppLogger, appLogger] = createLoggerContext({
        namespace: 'test:logger',
        level: 'debug',
      })

      const TestComponent = defineComponent({
        setup () {
          const logger = useAppLogger()
          expect(logger).toBe(appLogger)
          return {}
        },
        template: '<div />',
      })

      const app = createApp(TestComponent)
      provideAppLogger(appLogger, app)
      app.mount(document.createElement('div'))
    })

    it('should fallback logger functions work correctly', () => {
      const logger = useLogger('fallback:test')

      logger.debug('debug msg')
      logger.info('info msg')
      logger.warn('warn msg')
      logger.error('error msg')
      logger.trace('trace msg')
      logger.fatal('fatal msg')

      expect(console.debug).toHaveBeenCalled()
      expect(console.info).toHaveBeenCalled()
      expect(console.warn).toHaveBeenCalled()
      expect(console.error).toHaveBeenCalledTimes(2)
      expect(console.trace).toHaveBeenCalled()
    })

    it('fallback logger level and enable methods should be no-ops', () => {
      const logger = useLogger()

      logger.level('debug')
      logger.enable()
      logger.disable()

      expect(logger.current()).toBe('info')
      expect(logger.enabled()).toBe(true)
    })
  })
})
