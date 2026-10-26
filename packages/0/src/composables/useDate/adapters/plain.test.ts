import { describe, expect, it } from 'vitest'

import { PlainDateAdapter } from './plain'

// Utilities
import { isV0Error } from '#v0/utilities'

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
      expect(() => adapter.parseISO('2026-02-31T00:00:00Z')).toThrow('Invalid date')
      expect(() => adapter.parseISO('2026-02-01T25:00:00')).toThrow('Invalid date')
      expect(() => adapter.parseISO('not-a-dateZ')).toThrow('Invalid date')
      expect(() => adapter.parseISO('nope')).toThrow('Invalid date')

      try {
        adapter.parseISO('2026-02-31')
      } catch (error) {
        expect(isV0Error(error, 'V0_DATE_INVALID')).toBe(true)
        if (isV0Error(error, 'V0_DATE_INVALID')) {
          expect(error.value).toBe('2026-02-31')
        }
      }
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
      expect(adapter.parseISO('2026-02-01T15:04:05z').getTime()).toBe(native.getTime())
      expect(adapter.parseISO('2026-02-01T15:04:05+05:30').getTime()).toBe(new Date('2026-02-01T15:04:05+05:30').getTime())
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

    it('should start April on the previous Sunday', () => {
      const adapter = setup()
      const april = adapter.parseISO('2026-04-01')

      expect(adapter.toISO(adapter.getWeekArray(april)[0]![0]!)).toBe('2026-03-29')
    })
  })

  describe('years before 100', () => {
    it('should keep year 99 on the parsed day', () => {
      const adapter = setup()
      const date = adapter.parseISO('0099-01-01')

      expect(date.getFullYear()).toBe(99)
      expect(date.getMonth()).toBe(0)
      expect(date.getDate()).toBe(1)
      expect(adapter.toISO(date)).toBe('0099-01-01')
      expect(adapter.toISO(adapter.addDays(adapter.parseISO('0099-12-31'), 1))).toBe('0100-01-01')
      expect(adapter.toISO(adapter.addMonths(adapter.parseISO('0099-01-31'), 1))).toBe('0099-02-28')
      expect(adapter.getDaysInMonth(adapter.parseISO('0000-02-01'))).toBe(29)
      expect(adapter.getDaysInMonth(adapter.parseISO('0100-02-01'))).toBe(28)
      expect(adapter.getDiff(adapter.parseISO('0100-01-01'), '0099-01-01')).toBe(365)
    })

    it('should copy an offset instant in year 99', () => {
      const adapter = setup()
      const parsed = adapter.parseISO('0099-01-01T00:00:00Z')
      const native = new Date('0099-01-01T00:00:00Z')

      expect(parsed.getTime()).toBe(native.getTime())
      expect(parsed.getFullYear()).toBe(native.getFullYear())
    })
  })

  describe('clock', () => {
    it('should keep a fractional second and a space separator', () => {
      const adapter = setup()
      const fraction = adapter.parseISO('2026-02-01T15:04:05.1')
      const spaced = adapter.parseISO('2026-02-01 15:04:05')
      const precise = adapter.parseISO('2026-02-01T10:00:00.123456')

      expect(fraction.getHours()).toBe(15)
      expect(fraction.getMilliseconds()).toBe(100)
      expect(spaced.getHours()).toBe(15)
      expect(precise.getHours()).toBe(10)
      expect(precise.getMilliseconds()).toBe(123)
      expect(adapter.toISO(fraction)).toBe('2026-02-01')
    })

    it('should keep the clock when adding a day across DST', () => {
      const adapter = setup()
      const spring = adapter.parseISO('2026-03-08T01:30:00')
      const fall = adapter.parseISO('2026-11-01T00:30:00')
      const nextSpring = adapter.addDays(spring, 1)
      const nextFall = adapter.addDays(fall, 1)

      expect(adapter.toISO(nextSpring)).toBe('2026-03-09')
      expect(nextSpring.getHours()).toBe(1)
      expect(nextSpring.getMinutes()).toBe(30)
      expect(spring.getHours()).toBe(1)
      expect(adapter.toISO(nextFall)).toBe('2026-11-02')
      expect(nextFall.getHours()).toBe(0)
      expect(nextFall.getMinutes()).toBe(30)
    })

    it('should keep the clock when the month clamps', () => {
      const adapter = setup()
      const january = adapter.parseISO('2026-01-31T15:04:05')
      const february = adapter.setMonth(january, 1)

      expect(adapter.toISO(february)).toBe('2026-02-28')
      expect(february.getHours()).toBe(15)
      expect(february.getMinutes()).toBe(4)
      expect(adapter.toISO(january)).toBe('2026-01-31')
      expect(adapter.toISO(adapter.setMonth(adapter.parseISO('2024-01-31'), 1))).toBe('2024-02-29')
    })

    it('should clamp a leap day when adding a year', () => {
      const adapter = setup()

      expect(adapter.toISO(adapter.addYears(adapter.parseISO('2024-02-29'), 1))).toBe('2025-02-28')
    })
  })

  describe('comparisons', () => {
    it('should count calendar days across a short night', () => {
      const adapter = setup()
      const later = adapter.parseISO('2026-03-08T01:00:00')
      const earlier = adapter.parseISO('2026-03-07T23:00:00')

      expect(adapter.getDiff(later, earlier)).toBe(1)
      expect(adapter.getDiff(later, earlier, 'hours')).toBe(2)
      expect(adapter.getDiff(later, 'not-a-date')).toBe(0)
      expect(adapter.getDiff(later, '2026-03-07', 'days')).toBe(1)
    })

    it('should compare the calendar day separately from the instant', () => {
      const adapter = setup()
      const morning = adapter.parseISO('2026-02-01T01:00:00')
      const evening = adapter.parseISO('2026-02-01T23:00:00')

      expect(adapter.isValid(morning)).toBe(true)
      expect(adapter.isValid(new Date(Number.NaN))).toBe(false)
      expect(adapter.isSameDay(morning, evening)).toBe(true)
      expect(adapter.isEqual(morning, evening)).toBe(false)
      expect(adapter.isAfter(evening, morning)).toBe(true)
      expect(adapter.isAfterDay(evening, morning)).toBe(false)

      const early = adapter.parseISO('0999-06-15')
      const later = adapter.parseISO('1000-01-01')

      expect(adapter.toISO(early)).toBe('0999-06-15')
      expect(adapter.isAfterDay(later, early)).toBe(true)
      expect(adapter.isBeforeDay(early, later)).toBe(true)
    })

    it('should count complete months', () => {
      const adapter = setup()

      expect(adapter.getDiff(adapter.parseISO('2024-03-15'), adapter.parseISO('2024-01-20'), 'months')).toBe(1)
      expect(adapter.getDiff(adapter.parseISO('2024-03-20'), adapter.parseISO('2024-01-20'), 'months')).toBe(2)
      expect(adapter.getDiff(adapter.parseISO('2024-03-01'), adapter.parseISO('2024-01-31'), 'months')).toBe(1)
      expect(adapter.getDiff(adapter.parseISO('2025-01-01'), adapter.parseISO('2024-06-15'), 'years')).toBe(0)
      expect(adapter.getDiff(adapter.parseISO('2025-06-15'), adapter.parseISO('2024-06-15'), 'years')).toBe(1)
      expect(adapter.getDiff(adapter.parseISO('2025-02-01'), adapter.parseISO('2025-04-30'), 'months')).toBe(-2)
      expect(adapter.getDiff(adapter.parseISO('2025-02-28'), adapter.parseISO('2025-01-31'), 'months')).toBe(0)
      expect(adapter.getDiff(adapter.parseISO('2025-01-31'), adapter.parseISO('2025-02-28'), 'months')).toBe(0)
      expect(adapter.getDiff(adapter.parseISO('2025-02-28'), adapter.parseISO('2024-02-29'), 'months')).toBe(11)
      expect(adapter.getDiff(adapter.parseISO('2025-02-28'), adapter.parseISO('2024-02-29'), 'years')).toBe(0)
      expect(adapter.getDiff(adapter.parseISO('2024-02-29'), adapter.parseISO('2025-02-28'), 'months')).toBe(-11)
      expect(adapter.getDiff(adapter.parseISO('2024-02-29'), adapter.parseISO('2025-02-28'), 'years')).toBe(0)
      expect(adapter.getDiff(adapter.parseISO('2025-03-31'), adapter.parseISO('2025-01-31'), 'months')).toBe(2)
      expect(adapter.getDiff(adapter.parseISO('2025-03-30'), adapter.parseISO('2025-01-31'), 'months')).toBe(1)
      expect(adapter.getDiff(adapter.parseISO('2026-03-08T03:00:00'), adapter.parseISO('2026-01-08T02:30:00'), 'months')).toBe(2)
      expect(adapter.getDiff(adapter.parseISO('2026-01-08T02:30:00'), adapter.parseISO('2026-03-08T03:00:00'), 'months')).toBe(-2)
      expect(adapter.getDiff(adapter.parseISO('2026-03-01T09:00:00'), adapter.parseISO('2026-01-31T10:00:00'), 'months')).toBe(1)
      expect(adapter.getDiff(adapter.parseISO('2026-01-31T10:00:00'), adapter.parseISO('2026-03-01T09:00:00'), 'months')).toBe(0)
      expect(adapter.getDiff(adapter.parseISO('2024-03-20T09:00:00'), adapter.parseISO('2024-01-20T10:00:00'), 'months')).toBe(1)
      expect(adapter.getDiff(adapter.parseISO('2025-06-15T00:00:00'), adapter.parseISO('2024-06-15T00:00:01'), 'years')).toBe(0)
      expect(adapter.getDiff(adapter.parseISO('0000-02-29'), adapter.parseISO('0000-01-31'), 'months')).toBe(0)
      expect(adapter.getDiff(adapter.parseISO('0100-02-28'), adapter.parseISO('0100-01-31'), 'months')).toBe(0)
      expect(adapter.getDiff(adapter.parseISO('2026-02-01'), adapter.parseISO('2026-02-03'), 'weeks')).toBe(0)
      expect(adapter.getDiff(adapter.parseISO('2026-02-01T10:00:00'), adapter.parseISO('2026-02-01T10:30:00'), 'hours')).toBe(0)
    })
  })

  describe('date()', () => {
    it('should copy a date and reject an invalid one', () => {
      const adapter = setup()
      const existing = adapter.parseISO('2026-02-01T15:04:05')
      const copy = adapter.date(existing)

      expect(copy).not.toBe(existing)
      expect(copy!.getTime()).toBe(existing.getTime())

      existing.setHours(1)

      expect(copy!.getHours()).toBe(15)
      expect(adapter.date(new Date(Number.NaN))).toBeNull()
      expect(adapter.date('2026-02-31')).toBeNull()
      expect(Math.abs(adapter.date()!.getTime() - Date.now())).toBeLessThan(1000)
    })

    it('should ignore the format string', () => {
      const adapter = setup()

      expect(adapter.parse('2026-02-31', 'YYYY-MM-DD')).toBeNull()
      expect(adapter.toISO(adapter.parse('2026-02-01', 'ignored')!)).toBe('2026-02-01')
    })
  })

  describe('formatting', () => {
    it('should format a known preset and a token string', () => {
      const adapter = setup()
      const midnight = adapter.parseISO('2026-02-01T00:00:00')

      expect(adapter.format(midnight, 'year')).toBe('2026')
      expect(adapter.formatByString(midnight, 'YYYY-MM-DD h:mm A')).toBe('2026-02-01 12:00 AM')
      expect(adapter.formatByString(midnight, 'MMMM')).toBe('February')
    })
  })

  describe('week numbers', () => {
    it('should number the year boundary the way en-US does', () => {
      const adapter = setup()
      const january = adapter.parseISO('2026-01-01')

      expect(adapter.getWeek(adapter.parseISO('2024-12-29'))).toBe(1)
      expect(adapter.getWeek(adapter.parseISO('2025-01-05'))).toBe(2)
      expect(adapter.getWeek(january)).toBe(1)
      expect(adapter.getWeek(january, 4)).toBe(53)
    })

    it('should read minimalDays from the locale', () => {
      const adapter = setup()

      adapter.locale = 'de-DE'

      expect(adapter.firstDayOfWeek).toBe(1)
      expect(adapter.getWeek(adapter.parseISO('2027-01-01'))).toBe(53)
      expect(adapter.getWeek(adapter.parseISO('2027-01-04'))).toBe(1)
    })
  })
})
