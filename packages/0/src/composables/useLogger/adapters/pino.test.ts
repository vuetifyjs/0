import { describe, expect, it, vi } from 'vitest'

import { PinoLoggerAdapter } from './pino'

describe('pinoLoggerAdapter', () => {
  it('should throw if pino instance is not provided', () => {
    expect(() => new PinoLoggerAdapter(null)).toThrow(
      'Pino instance is required for PinoLoggerAdapter',
    )
    expect(() => new PinoLoggerAdapter(undefined)).toThrow(
      'Pino instance is required for PinoLoggerAdapter',
    )
  })

  it('should format message-only calls correctly', () => {
    const mockPino = { info: vi.fn() }
    const adapter = new PinoLoggerAdapter(mockPino)

    adapter.info('test message')

    expect(mockPino.info).toHaveBeenCalledWith({ msg: 'test message' })
  })

  it('should merge object metadata with message', () => {
    const mockPino = { info: vi.fn() }
    const adapter = new PinoLoggerAdapter(mockPino)

    adapter.info('test message', { userId: 123, action: 'login' })

    expect(mockPino.info).toHaveBeenCalledWith({
      userId: 123,
      action: 'login',
      msg: 'test message',
    })
  })

  it('should include non-object args in metadata', () => {
    const mockPino = { info: vi.fn() }
    const adapter = new PinoLoggerAdapter(mockPino)

    adapter.info('test message', 'arg1', 'arg2')

    expect(mockPino.info).toHaveBeenCalledWith({
      msg: 'test message',
      args: ['arg1', 'arg2'],
    })
  })

  it('should forward debug calls', () => {
    const mockPino = { debug: vi.fn() }
    const adapter = new PinoLoggerAdapter(mockPino)

    adapter.debug('debug message')

    expect(mockPino.debug).toHaveBeenCalledWith({ msg: 'debug message' })
  })

  it('should forward warn calls', () => {
    const mockPino = { warn: vi.fn() }
    const adapter = new PinoLoggerAdapter(mockPino)

    adapter.warn('warning message')

    expect(mockPino.warn).toHaveBeenCalledWith({ msg: 'warning message' })
  })

  it('should forward error calls', () => {
    const mockPino = { error: vi.fn() }
    const adapter = new PinoLoggerAdapter(mockPino)

    adapter.error('error message', { errorCode: 500 })

    expect(mockPino.error).toHaveBeenCalledWith({
      errorCode: 500,
      msg: 'error message',
    })
  })

  it('should forward trace calls', () => {
    const mockPino = { trace: vi.fn() }
    const adapter = new PinoLoggerAdapter(mockPino)

    adapter.trace('trace message')

    expect(mockPino.trace).toHaveBeenCalledWith({ msg: 'trace message' })
  })

  it('should forward fatal calls', () => {
    const mockPino = { fatal: vi.fn() }
    const adapter = new PinoLoggerAdapter(mockPino)

    adapter.fatal('fatal message')

    expect(mockPino.fatal).toHaveBeenCalledWith({ msg: 'fatal message' })
  })

  it('should handle mixed arguments with first object', () => {
    const mockPino = { info: vi.fn() }
    const adapter = new PinoLoggerAdapter(mockPino)

    adapter.info('message', { metadata: true }, 'extra')

    expect(mockPino.info).toHaveBeenCalledWith({
      msg: 'message',
      args: [{ metadata: true }, 'extra'],
    })
  })
})
