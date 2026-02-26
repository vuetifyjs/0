import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { PinoLoggerAdapter } from './pino'

describe('pinoLoggerAdapter', () => {
  let mockPino: Record<string, ReturnType<typeof vi.fn>>

  beforeEach(() => {
    mockPino = {
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
    it('should initialize with a pino instance', () => {
      const adapter = new PinoLoggerAdapter(mockPino)

      adapter.info('test message')

      expect(mockPino.info).toHaveBeenCalledWith({ msg: 'test message' })
    })

    it('should throw if pino instance is not provided', () => {
      expect(() => new PinoLoggerAdapter(null)).toThrow(
        'Pino instance is required for PinoLoggerAdapter',
      )
      expect(() => new PinoLoggerAdapter(undefined)).toThrow(
        'Pino instance is required for PinoLoggerAdapter',
      )
    })
  })

  describe('log methods', () => {
    it('should call debug', () => {
      const adapter = new PinoLoggerAdapter(mockPino)

      adapter.debug('debug message')

      expect(mockPino.debug).toHaveBeenCalledWith({ msg: 'debug message' })
    })

    it('should call info', () => {
      const adapter = new PinoLoggerAdapter(mockPino)

      adapter.info('test message')

      expect(mockPino.info).toHaveBeenCalledWith({ msg: 'test message' })
    })

    it('should call warn', () => {
      const adapter = new PinoLoggerAdapter(mockPino)

      adapter.warn('warning message')

      expect(mockPino.warn).toHaveBeenCalledWith({ msg: 'warning message' })
    })

    it('should call error', () => {
      const adapter = new PinoLoggerAdapter(mockPino)

      adapter.error('error message', { errorCode: 500 })

      expect(mockPino.error).toHaveBeenCalledWith({
        errorCode: 500,
        msg: 'error message',
      })
    })
  })

  describe('trace and fatal', () => {
    it('should call trace', () => {
      const adapter = new PinoLoggerAdapter(mockPino)

      adapter.trace('trace message')

      expect(mockPino.trace).toHaveBeenCalledWith({ msg: 'trace message' })
    })

    it('should call fatal', () => {
      const adapter = new PinoLoggerAdapter(mockPino)

      adapter.fatal('fatal message')

      expect(mockPino.fatal).toHaveBeenCalledWith({ msg: 'fatal message' })
    })
  })

  describe('metadata formatting', () => {
    it('should merge object metadata with message', () => {
      const adapter = new PinoLoggerAdapter(mockPino)

      adapter.info('test message', { userId: 123, action: 'login' })

      expect(mockPino.info).toHaveBeenCalledWith({
        userId: 123,
        action: 'login',
        msg: 'test message',
      })
    })

    it('should include non-object args in metadata', () => {
      const adapter = new PinoLoggerAdapter(mockPino)

      adapter.info('test message', 'arg1', 'arg2')

      expect(mockPino.info).toHaveBeenCalledWith({
        msg: 'test message',
        args: ['arg1', 'arg2'],
      })
    })

    it('should handle mixed arguments with first object', () => {
      const adapter = new PinoLoggerAdapter(mockPino)

      adapter.info('message', { metadata: true }, 'extra')

      expect(mockPino.info).toHaveBeenCalledWith({
        msg: 'message',
        args: [{ metadata: true }, 'extra'],
      })
    })
  })
})
