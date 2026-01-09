/**
 * SSR-specific tests for useDate composable.
 *
 * These tests run with IN_BROWSER = false to validate server-side behavior.
 * Separated from main tests because vi.mock is hoisted and applies file-wide.
 */
import { describe, it, expect, vi } from 'vitest'

// Mock IN_BROWSER as false to simulate SSR environment
vi.mock('#v0/constants/globals', () => ({
  IN_BROWSER: false,
}))

// Adapters
// Import after mock is set up
import { Vuetify0DateAdapter } from './adapters/v0'

import { useDate, createDateFallback } from './index'

describe('useDate SSR', () => {
  describe('useDate outside component in SSR', () => {
    it('should return fallback context when called outside component', () => {
      // In SSR without getCurrentInstance(), useDate should return fallback
      const ctx = useDate()

      expect(ctx).toBeDefined()
      expect(ctx.adapter).toBeInstanceOf(Vuetify0DateAdapter)
      expect(ctx.locale.value).toBe('en-US')
    })

    it('should return fallback with custom namespace outside component', () => {
      const ctx = useDate('custom:namespace')

      expect(ctx).toBeDefined()
      expect(ctx.adapter).toBeInstanceOf(Vuetify0DateAdapter)
    })

    it('should return epoch from fallback adapter in SSR', () => {
      const ctx = useDate()
      const date = ctx.adapter.date()

      // In SSR, date() without args returns epoch
      expect(date).not.toBeNull()
      expect(date!.year).toBe(1970)
      expect(date!.month).toBe(1)
      expect(date!.day).toBe(1)
    })

    it('createDateFallback should work in SSR', () => {
      const fallback = createDateFallback()

      expect(fallback.adapter).toBeInstanceOf(Vuetify0DateAdapter)
      expect(fallback.locale.value).toBe('en-US')

      // Should use epoch for current date in SSR
      const date = fallback.adapter.date()
      expect(date!.year).toBe(1970)
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

      // Explicit values should work normally in SSR
      const fromString = adapter.date('2024-06-15T10:30:00')
      expect(fromString).not.toBeNull()
      expect(fromString!.year).toBe(2024)
      expect(fromString!.month).toBe(6)

      const fromTimestamp = adapter.date(1_718_444_400_000) // 2024-06-15
      expect(fromTimestamp).not.toBeNull()
      expect(fromTimestamp!.year).toBe(2024)
    })

    it('should format dates correctly in SSR', () => {
      const adapter = new Vuetify0DateAdapter('en-US')
      const date = adapter.date('2024-06-15T10:30:00')!

      // Formatting should work in SSR
      const formatted = adapter.format(date, 'year')
      expect(formatted).toBe('2024')
    })

    it('should perform date arithmetic in SSR', () => {
      const adapter = new Vuetify0DateAdapter('en-US')
      const date = adapter.date('2024-06-15T10:30:00')!

      const nextDay = adapter.addDays(date, 1)
      expect(nextDay.day).toBe(16)
    })
  })
})
