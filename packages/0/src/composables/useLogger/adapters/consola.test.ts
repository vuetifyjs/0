import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ConsolaLoggerAdapter } from './consola'

describe('consolaLoggerAdapter', () => {
  let mockConsola: Record<string, ReturnType<typeof vi.fn>>

  beforeEach(() => {
    mockConsola = {
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      trace: vi.fn(),
      fatal: vi.fn(),
    }
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('constructor', () => {
    it('should initialize with a consola instance', () => {
      const adapter = new ConsolaLoggerAdapter(mockConsola)

      adapter.info('test')

      expect(mockConsola.info).toHaveBeenCalledWith('test')
    })

    it('should throw if consola instance is not provided', () => {
      expect(() => new ConsolaLoggerAdapter(null)).toThrow(
        'Consola instance is required for ConsolaLoggerAdapter',
      )
      expect(() => new ConsolaLoggerAdapter(undefined)).toThrow(
        'Consola instance is required for ConsolaLoggerAdapter',
      )
    })
  })

  describe('log methods', () => {
    it('should call debug', () => {
      const adapter = new ConsolaLoggerAdapter(mockConsola)

      adapter.debug('test message', { extra: 'data' })

      expect(mockConsola.debug).toHaveBeenCalledWith('test message', { extra: 'data' })
    })

    it('should call info', () => {
      const adapter = new ConsolaLoggerAdapter(mockConsola)

      adapter.info('info message')

      expect(mockConsola.info).toHaveBeenCalledWith('info message')
    })

    it('should call warn', () => {
      const adapter = new ConsolaLoggerAdapter(mockConsola)

      adapter.warn('warning message')

      expect(mockConsola.warn).toHaveBeenCalledWith('warning message')
    })

    it('should call error', () => {
      const adapter = new ConsolaLoggerAdapter(mockConsola)

      adapter.error('error message', new Error('test'))

      expect(mockConsola.error).toHaveBeenCalledWith('error message', expect.any(Error))
    })
  })

  describe('trace and fatal fallbacks', () => {
    it('should use trace if available on consola', () => {
      const adapter = new ConsolaLoggerAdapter(mockConsola)

      adapter.trace('trace message')

      expect(mockConsola.trace).toHaveBeenCalledWith('trace message')
    })

    it('should fallback to debug if trace is not available', () => {
      const limited = { debug: vi.fn() }
      const adapter = new ConsolaLoggerAdapter(limited)

      adapter.trace('trace message')

      expect(limited.debug).toHaveBeenCalledWith('trace message')
    })

    it('should use fatal if available on consola', () => {
      const adapter = new ConsolaLoggerAdapter(mockConsola)

      adapter.fatal('fatal message')

      expect(mockConsola.fatal).toHaveBeenCalledWith('fatal message')
    })

    it('should fallback to error with FATAL prefix if fatal is not available', () => {
      const limited = { error: vi.fn() }
      const adapter = new ConsolaLoggerAdapter(limited)

      adapter.fatal('fatal message')

      expect(limited.error).toHaveBeenCalledWith('[FATAL]', 'fatal message')
    })
  })

  describe('edge cases', () => {
    it('should pass multiple arguments through', () => {
      const adapter = new ConsolaLoggerAdapter(mockConsola)

      adapter.info('message', 'arg1', 'arg2', { key: 'value' })

      expect(mockConsola.info).toHaveBeenCalledWith('message', 'arg1', 'arg2', { key: 'value' })
    })
  })
})
