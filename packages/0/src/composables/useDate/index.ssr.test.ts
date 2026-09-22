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
import { V0DateAdapter } from './adapters/v0'

import { createDate, createDatePlugin, useDate } from './index'

describe('useDate SSR', () => {
  describe('useDate outside component in SSR', () => {
    it('should throw when called outside component in SSR', () => {
      expect(() => useDate()).toThrow('[v0] useDate() must be called inside a Vue component')
    })
  })

  describe('createDate in SSR', () => {
    it('should resolve locale from options', () => {
      const adapter = new V0DateAdapter('en-US')
      const ctx = createDate({ adapter, locale: 'de-DE' })

      expect(ctx.locale.value).toBe('de-DE')
    })

    it('should fall back to adapter locale', () => {
      const adapter = new V0DateAdapter('fr-FR')
      const ctx = createDate({ adapter })

      expect(ctx.locale.value).toBe('fr-FR')
    })

    it('should map short locale codes to full Intl strings', () => {
      const adapter = new V0DateAdapter('en-US')
      const ctx = createDate({ adapter, locale: 'ja' })

      expect(ctx.locale.value).toBe('ja-JP')
    })

    it('should sync adapter locale on creation', () => {
      const adapter = new V0DateAdapter('en-US')
      createDate({ adapter, locale: 'es-ES' })

      expect(adapter.locale).toBe('es-ES')
    })

    it('should derive firstDayOfWeek=1 (Monday) for de-DE in SSR', () => {
      const adapter = new V0DateAdapter('en-US')
      const ctx = createDate({ adapter, locale: 'de-DE' })

      expect(ctx.firstDayOfWeek.value).toBe(1)
      expect(adapter.firstDayOfWeek).toBe(1)
    })

    it('should derive firstDayOfWeek=0 (Sunday) for en-US in SSR', () => {
      const adapter = new V0DateAdapter('en-US')
      const ctx = createDate({ adapter, locale: 'en-US' })

      expect(ctx.firstDayOfWeek.value).toBe(0)
      expect(adapter.firstDayOfWeek).toBe(0)
    })

    it('should derive firstDayOfWeek=6 (Saturday) for ar-EG in SSR', () => {
      const adapter = new V0DateAdapter('en-US')
      const ctx = createDate({ adapter, locale: 'ar-EG' })

      expect(ctx.firstDayOfWeek.value).toBe(6)
      expect(adapter.firstDayOfWeek).toBe(6)
    })

    it('should honor an explicit firstDayOfWeek override in SSR', () => {
      const adapter = new V0DateAdapter('en-US')
      const ctx = createDate({ adapter, locale: 'de-DE', firstDayOfWeek: 6 })

      expect(ctx.firstDayOfWeek.value).toBe(6)
      expect(adapter.firstDayOfWeek).toBe(6)
    })
  })

  describe('adapter isolation across separate requests in SSR', () => {
    it('should not share locale/firstDayOfWeek state between two independently constructed adapters', () => {
      // Simulates the recommended per-request pattern: a fresh adapter (and
      // fresh plugin) constructed for each request, rather than one shared
      // module-scope instance reused across requests.
      const requestOneAdapter = new V0DateAdapter('en-US')
      const requestOnePlugin = createDatePlugin({ adapter: requestOneAdapter, locale: 'de-DE' })

      const requestTwoAdapter = new V0DateAdapter('en-US')
      const requestTwoPlugin = createDatePlugin({ adapter: requestTwoAdapter, locale: 'ar-EG' })

      function mockApp () {
        return {
          provide: vi.fn(),
          config: { globalProperties: {} },
          _context: {},
          runWithContext: (fn: () => void) => fn(),
        }
      }

      requestOnePlugin.install(mockApp() as never)
      requestTwoPlugin.install(mockApp() as never)

      expect(requestOneAdapter.locale).toBe('de-DE')
      expect(requestOneAdapter.firstDayOfWeek).toBe(1)

      expect(requestTwoAdapter.locale).toBe('ar-EG')
      expect(requestTwoAdapter.firstDayOfWeek).toBe(6)

      // Confirms these are genuinely distinct instances, not the same
      // adapter observed twice.
      expect(requestOneAdapter).not.toBe(requestTwoAdapter)
    })

    it('should give each plugin install its own context rather than sharing one across apps', () => {
      // Regression guard for the eager createDateContext() call that used to
      // run once at createDatePlugin() time and get reused by every install.
      const adapter = new V0DateAdapter('en-US')
      const plugin = createDatePlugin({ adapter, locale: 'fr-FR' })

      const provided: unknown[] = []
      function mockApp () {
        return {
          provide: (_key: unknown, value: unknown) => provided.push(value),
          config: { globalProperties: {} },
          _context: {},
          runWithContext: (fn: () => void) => fn(),
        }
      }

      plugin.install(mockApp() as never)
      plugin.install(mockApp() as never)

      expect(provided).toHaveLength(2)
      expect(provided[0]).not.toBe(provided[1])
    })
  })

  describe('createDatePlugin in SSR', () => {
    it('should create a valid Vue plugin', () => {
      const adapter = new V0DateAdapter('en-US')
      const plugin = createDatePlugin({ adapter })

      expect(plugin).toBeDefined()
      expect(typeof plugin.install).toBe('function')
    })

    it('should install on a mock app', () => {
      const adapter = new V0DateAdapter('en-US')
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

  describe('v0DateAdapter in SSR mode', () => {
    it('should return epoch when date() called without arguments', () => {
      const adapter = new V0DateAdapter('en-US')
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
      const adapter = new V0DateAdapter('en-US')
      const date = adapter.date(null)

      expect(date).not.toBeNull()
      expect(date!.year).toBe(1970)
    })

    it('should return epoch for undefined input', () => {
      const adapter = new V0DateAdapter('en-US')
      const date = adapter.date(undefined)

      expect(date).not.toBeNull()
      expect(date!.year).toBe(1970)
    })

    it('should still parse explicit date values correctly', () => {
      const adapter = new V0DateAdapter('en-US')

      const fromString = adapter.date('2024-06-15T10:30:00')
      expect(fromString).not.toBeNull()
      expect(fromString!.year).toBe(2024)
      expect(fromString!.month).toBe(6)

      const fromTimestamp = adapter.date(1_718_444_400_000)
      expect(fromTimestamp).not.toBeNull()
      expect(fromTimestamp!.year).toBe(2024)
    })

    it('should format dates correctly in SSR', () => {
      const adapter = new V0DateAdapter('en-US')
      const date = adapter.date('2024-06-15T10:30:00')!

      const formatted = adapter.format(date, 'year')
      expect(formatted).toBe('2024')
    })

    it('should perform date arithmetic in SSR', () => {
      const adapter = new V0DateAdapter('en-US')
      const date = adapter.date('2024-06-15T10:30:00')!

      const nextDay = adapter.addDays(date, 1)
      expect(nextDay.day).toBe(16)
    })

    it('should calculate week numbers in SSR', () => {
      const adapter = new V0DateAdapter('en-US')
      const date = adapter.date('2024-06-15T00:00:00')!

      expect(adapter.getWeek(date)).toBe(24)

      const jan5 = adapter.date('2024-01-05T00:00:00')!
      expect(adapter.getWeek(jan5)).toBe(1)

      const startOfWeek = adapter.startOfWeek(date)
      expect(startOfWeek.dayOfWeek).toBe(7)
    })
  })
})
