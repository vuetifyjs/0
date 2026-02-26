/**
 * SSR-specific tests for useDate composable.
 *
 * These tests run with IN_BROWSER = false to validate server-side behavior.
 * Separated from main tests because vi.mock is hoisted and applies file-wide.
 */
import { describe, it, expect, vi } from 'vitest'

vi.mock('#v0/constants/globals', () => ({
  IN_BROWSER: false,
}))

// Adapters
import { Vuetify0DateAdapter } from './adapters/v0'

import { createDate, createDatePlugin, useDate } from './index'

describe('useDate SSR', () => {
  describe('useDate outside component in SSR', () => {
    it('should throw when called outside component in SSR', () => {
      expect(() => useDate()).toThrow('[v0] useDate() must be called inside a Vue component')
    })
  })

  describe('createDate in SSR', () => {
    it('should resolve locale from options', () => {
      const adapter = new Vuetify0DateAdapter('en-US')
      const ctx = createDate({ adapter, locale: 'de-DE' })

      expect(ctx.locale.value).toBe('de-DE')
    })

    it('should fall back to adapter locale', () => {
      const adapter = new Vuetify0DateAdapter('fr-FR')
      const ctx = createDate({ adapter })

      expect(ctx.locale.value).toBe('fr-FR')
    })

    it('should map short locale codes to full Intl strings', () => {
      const adapter = new Vuetify0DateAdapter('en-US')
      const ctx = createDate({ adapter, locale: 'ja' })

      expect(ctx.locale.value).toBe('ja-JP')
    })

    it('should sync adapter locale on creation', () => {
      const adapter = new Vuetify0DateAdapter('en-US')
      createDate({ adapter, locale: 'es-ES' })

      expect(adapter.locale).toBe('es-ES')
    })
  })

  describe('createDatePlugin in SSR', () => {
    it('should create a valid Vue plugin', () => {
      const adapter = new Vuetify0DateAdapter('en-US')
      const plugin = createDatePlugin({ adapter })

      expect(plugin).toBeDefined()
      expect(typeof plugin.install).toBe('function')
    })

    it('should install on a mock app', () => {
      const adapter = new Vuetify0DateAdapter('en-US')
      const plugin = createDatePlugin({ adapter })
      const mockApp = {
        provide: vi.fn(),
        config: { globalProperties: {} },
        _context: {},
        runWithContext: (fn: () => void) => fn(),
      }

      expect(() => plugin.install(mockApp as never)).not.toThrow()
    })
  })

  describe('vuetify0DateAdapter in SSR mode', () => {
    it('should return epoch when date() called without arguments', () => {
      const adapter = new Vuetify0DateAdapter('en-US')
      const date = adapter.date()

      expect(date).not.toBeNull()
      expect(date!.year).toBe(1970)
      expect(date!.month).toBe(1)
      expect(date!.day).toBe(1)
      expect(date!.hour).toBe(0)
      expect(date!.minute).toBe(0)
      expect(date!.second).toBe(0)
    })

    it('should return epoch for null input', () => {
      const adapter = new Vuetify0DateAdapter('en-US')
      const date = adapter.date(null)

      expect(date).not.toBeNull()
      expect(date!.year).toBe(1970)
    })

    it('should return epoch for undefined input', () => {
      const adapter = new Vuetify0DateAdapter('en-US')
      const date = adapter.date(undefined)

      expect(date).not.toBeNull()
      expect(date!.year).toBe(1970)
    })

    it('should still parse explicit date values correctly', () => {
      const adapter = new Vuetify0DateAdapter('en-US')

      const fromString = adapter.date('2024-06-15T10:30:00')
      expect(fromString).not.toBeNull()
      expect(fromString!.year).toBe(2024)
      expect(fromString!.month).toBe(6)

      const fromTimestamp = adapter.date(1_718_444_400_000)
      expect(fromTimestamp).not.toBeNull()
      expect(fromTimestamp!.year).toBe(2024)
    })

    it('should format dates correctly in SSR', () => {
      const adapter = new Vuetify0DateAdapter('en-US')
      const date = adapter.date('2024-06-15T10:30:00')!

      const formatted = adapter.format(date, 'year')
      expect(formatted).toBe('2024')
    })

    it('should perform date arithmetic in SSR', () => {
      const adapter = new Vuetify0DateAdapter('en-US')
      const date = adapter.date('2024-06-15T10:30:00')!

      const nextDay = adapter.addDays(date, 1)
      expect(nextDay.day).toBe(16)
    })

    it('should calculate week numbers in SSR', () => {
      const adapter = new Vuetify0DateAdapter('en-US')
      const date = adapter.date('2024-06-15T00:00:00')!

      expect(adapter.getWeek(date)).toBe(24)

      const jan5 = adapter.date('2024-01-05T00:00:00')!
      expect(adapter.getWeek(jan5, 0)).toBe(1)

      const startOfWeek = adapter.startOfWeek(date, 0)
      expect(startOfWeek.dayOfWeek).toBe(7)
    })
  })
})
