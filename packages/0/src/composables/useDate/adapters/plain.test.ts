import { describe, expect, it } from 'vitest'

import { PlainDateAdapter } from './plain'

describe('plainDateAdapter', () => {
  function setup () {
    return new PlainDateAdapter('en-US')
  }

  describe('parse and format', () => {
    it('should parse a date-only string as local midnight', () => {
      const adapter = setup()
      const date = adapter.parseISO('2026-02-01')

      expect(date.getFullYear()).toBe(2026)
      expect(date.getMonth()).toBe(1)
      expect(date.getDate()).toBe(1)
      expect(date.getHours()).toBe(0)
      expect(date.getMinutes()).toBe(0)
      expect(adapter.toISO(date)).toBe('2026-02-01')
    })

    it('should reject an impossible calendar day', () => {
      const adapter = setup()

      expect(() => adapter.parseISO('2026-02-31')).toThrow('Invalid date')
      expect(() => adapter.parseISO('2026-02-31T10:00:00')).toThrow('Invalid date')
    })

    it('should rebuild an offset string from local fields', () => {
      const adapter = setup()
      const parsed = adapter.parseISO('2026-02-01T15:04:05Z')
      const native = new Date('2026-02-01T15:04:05Z')

      expect(parsed.getFullYear()).toBe(native.getFullYear())
      expect(parsed.getMonth()).toBe(native.getMonth())
      expect(parsed.getDate()).toBe(native.getDate())
      expect(parsed.getHours()).toBe(native.getHours())
      expect(parsed.getMinutes()).toBe(native.getMinutes())
    })

    it('should treat numbers as invalid', () => {
      const adapter = setup()

      expect(adapter.isValid(1)).toBe(false)
      expect(adapter.isValid('2026-02-01')).toBe(true)
      expect(adapter.isValid('2026-02-31')).toBe(false)
    })
  })

  describe('arithmetic', () => {
    it('should clamp a month addition to the last valid day', () => {
      const adapter = setup()
      const january = adapter.parseISO('2026-01-31')
      const leap = adapter.parseISO('2024-01-31')

      expect(adapter.toISO(adapter.addMonths(january, 1))).toBe('2026-02-28')
      expect(adapter.toISO(adapter.addMonths(leap, 1))).toBe('2024-02-29')
    })

    it('should add a day across a DST boundary', () => {
      const adapter = setup()
      const date = adapter.parseISO('2026-03-07')

      expect(adapter.toISO(adapter.addDays(date, 1))).toBe('2026-03-08')
    })

    it('should start a Monday week on the previous Monday', () => {
      const adapter = setup()
      adapter.firstDayOfWeek = 1
      const sunday = adapter.parseISO('2026-02-01')

      expect(adapter.toISO(adapter.startOfWeek(sunday))).toBe('2026-01-26')
      expect(adapter.firstDayOfWeek).toBe(1)
    })
  })

  describe('weeks', () => {
    it('should pad getWeekArray to six rows', () => {
      const adapter = setup()
      const february = adapter.parseISO('2026-02-01')

      expect(adapter.getWeekArray(february)).toHaveLength(4)
      expect(adapter.getWeekArray(february, true)).toHaveLength(6)
      expect(adapter.toISO(adapter.getWeekArray(february)[0]![0]!)).toBe('2026-02-01')
    })

    it('should assign firstDayOfWeek without clearing the locale', () => {
      const adapter = setup()

      adapter.firstDayOfWeek = 1

      expect(adapter.firstDayOfWeek).toBe(1)
      expect(adapter.locale).toBe('en-US')
    })
  })
})
