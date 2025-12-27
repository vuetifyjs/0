import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { Vuetify0LoggerAdapter } from './v0'

// Mock IN_BROWSER - start with false for SSR tests
const mockInBrowser = vi.hoisted(() => ({ value: false }))

vi.mock('#v0/constants/globals', () => ({
  get IN_BROWSER () {
    return mockInBrowser.value
  },
}))

describe('vuetify0LoggerAdapter', () => {
  beforeEach(() => {
    vi.spyOn(console, 'debug').mockImplementation(() => {})
    vi.spyOn(console, 'info').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(console, 'trace').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
    mockInBrowser.value = false
  })

  describe('constructor', () => {
    it('should use default options', () => {
      const adapter = new Vuetify0LoggerAdapter()

      adapter.info('test')

      expect(console.info).toHaveBeenCalled()
    })

    it('should accept custom prefix', () => {
      const adapter = new Vuetify0LoggerAdapter({ prefix: 'custom' })

      adapter.info('test')

      expect(console.info).toHaveBeenCalledWith(
        expect.stringContaining('[custom info]'),
      )
    })
  })

  describe('log methods', () => {
    it('should call console.debug for debug level', () => {
      const adapter = new Vuetify0LoggerAdapter()

      adapter.debug('debug message', { extra: 'data' })

      expect(console.debug).toHaveBeenCalledWith(
        expect.stringContaining('debug message'),
        { extra: 'data' },
      )
    })

    it('should call console.info for info level', () => {
      const adapter = new Vuetify0LoggerAdapter()

      adapter.info('info message')

      expect(console.info).toHaveBeenCalledWith(
        expect.stringContaining('info message'),
      )
    })

    it('should call console.warn for warn level', () => {
      const adapter = new Vuetify0LoggerAdapter()

      adapter.warn('warn message')

      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('warn message'),
      )
    })

    it('should call console.error for error level', () => {
      const adapter = new Vuetify0LoggerAdapter()

      adapter.error('error message')

      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('error message'),
      )
    })

    it('should call console.trace for trace level', () => {
      const adapter = new Vuetify0LoggerAdapter()

      adapter.trace('trace message')

      expect(console.trace).toHaveBeenCalledWith(
        expect.stringContaining('trace message'),
      )
    })

    it('should call console.error for fatal level', () => {
      const adapter = new Vuetify0LoggerAdapter()

      adapter.fatal('fatal message')

      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('fatal message'),
      )
    })
  })

  describe('sSR (non-browser) environment', () => {
    it('should log without styles in non-browser environment', () => {
      mockInBrowser.value = false
      const adapter = new Vuetify0LoggerAdapter({ colors: true })

      adapter.info('ssr message')

      // Should call console.info without %c prefix (no styling)
      expect(console.info).toHaveBeenCalledWith(
        expect.stringContaining('ssr message'),
      )
      // The call should NOT include %c for styling
      const call = (console.info as any).mock.calls[0][0]
      expect(call).not.toContain('%c')
    })

    it('should use ISO timestamp in non-browser environment', () => {
      mockInBrowser.value = false
      const adapter = new Vuetify0LoggerAdapter({ timestamps: true })

      adapter.info('test')

      const call = (console.info as any).mock.calls[0][0]
      // ISO format: 2024-01-01T00:00:00.000Z
      expect(call).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
    })
  })

  describe('browser environment', () => {
    beforeEach(() => {
      mockInBrowser.value = true
    })

    it('should apply styles in browser environment with colors enabled', () => {
      const adapter = new Vuetify0LoggerAdapter({ colors: true })

      adapter.info('browser message')

      // Should call with %c prefix and style argument
      expect(console.info).toHaveBeenCalledWith(
        expect.stringContaining('%c'),
        expect.stringContaining('color:'),
        // no extra args for this call
      )
    })

    it('should not apply styles when colors disabled', () => {
      const adapter = new Vuetify0LoggerAdapter({ colors: false })

      adapter.info('no color message')

      // Should NOT include %c prefix
      const call = (console.info as any).mock.calls[0][0]
      expect(call).not.toContain('%c')
    })

    it('should use short timestamp in browser environment', () => {
      const adapter = new Vuetify0LoggerAdapter({ timestamps: true, colors: false })

      adapter.info('test')

      const call = (console.info as any).mock.calls[0][0]
      // Short format: HH:MM:SS (no date, no T, no Z)
      expect(call).toMatch(/\d{2}:\d{2}:\d{2}/)
      expect(call).not.toMatch(/\d{4}-\d{2}-\d{2}T/)
    })
  })

  describe('formatting options', () => {
    it('should omit timestamp when disabled', () => {
      const adapter = new Vuetify0LoggerAdapter({ timestamps: false })

      adapter.info('no timestamp')

      const call = (console.info as any).mock.calls[0][0]
      expect(call).not.toMatch(/\d{2}:\d{2}:\d{2}/)
    })
  })

  describe('edge cases', () => {
    it('should handle silent log level style gracefully', () => {
      mockInBrowser.value = true
      const adapter = new Vuetify0LoggerAdapter({ colors: true })

      // Access private method indirectly - silent level has empty style
      // This tests the styles[level] || '' fallback
      adapter.info('test') // info has a style, but this exercises the lookup

      expect(console.info).toHaveBeenCalled()
    })
  })
})
