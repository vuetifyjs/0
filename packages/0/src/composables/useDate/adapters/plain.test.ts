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

  describe('remaining date-io surface', () => {
    it('should accept an epoch number and reject other values', () => {
      const adapter = setup()
      const morning = adapter.parseISO('2026-02-01T09:05:06')
      const copy = adapter.toJsDate(morning)

      expect(adapter.date(0)!.getTime()).toBe(0)
      expect(adapter.date(Number.NaN)).toBeNull()
      expect(adapter.date(Number.POSITIVE_INFINITY)).toBeNull()
      expect(adapter.date({})).toBeNull()
      expect(copy).not.toBe(morning)
      expect(copy.getTime()).toBe(morning.getTime())
      expect(adapter.isNullish(null)).toBe(true)
      expect(adapter.isNullish(morning)).toBe(false)
      expect(adapter.getCurrentLocaleCode()).toBe('en-US')
      expect(adapter.is12HourCycleInCurrentLocale()).toBe(true)
      expect(new PlainDateAdapter('de-DE').is12HourCycleInCurrentLocale()).toBe(false)

      adapter.locale = 'en-US'

      expect(adapter.locale).toBe('en-US')
    })

    it('should reject an impossible offset and default omitted seconds', () => {
      const adapter = setup()

      expect(adapter.parseISO('2026-02-01T15:04').getSeconds()).toBe(0)
      expect(() => adapter.parseISO('2026-02-01T15:04:05+25:00')).toThrow('Invalid date')
      expect(() => adapter.parseISO('2026-02-01T15:04:05+05:99')).toThrow('Invalid date')
      expect(adapter.parseISO('2026-02-01T15:04:05-05:30').getTime()).toBe(new Date('2026-02-01T15:04:05-05:30').getTime())
    })

    it('should format tokens, helpers, and meridiem text', () => {
      const adapter = setup()
      const midnight = adapter.parseISO('2026-02-01T00:00:00')
      const afternoon = adapter.parseISO('2026-02-01T15:05:06')
      const fallback = adapter.format(afternoon, 'not-a-preset')

      expect(fallback).toContain('2026')
      expect(adapter.format(afternoon, 'not-a-preset')).toBe(fallback)
      expect(adapter.format(afternoon, 'year')).toBe('2026')
      expect(adapter.formatByString(afternoon, 'YY M D HH H hh h m ss s a MMM ddd dddd')).toBe('26 2 1 15 15 03 3 5 06 6 pm Feb Sun Sunday')
      expect(adapter.formatByString(midnight, 'hh A a')).toBe('12 AM am')
      expect(adapter.formatByString(afternoon, 'A')).toBe('PM')
      expect(adapter.getFormatHelperText('keyboardDate')).toBe('mm/dd/yyyy')
      expect(adapter.getFormatHelperText('keyboardDateTime')).toBe('mm/dd/yyyy hh:mm')
      expect(adapter.getFormatHelperText('keyboardDateTime12h')).toBe('mm/dd/yyyy hh:mm am/pm')
      expect(adapter.getFormatHelperText('keyboardDateTime24h')).toBe('mm/dd/yyyy hh:mm')
      expect(adapter.getFormatHelperText('YYYY-MM-DD HH')).toBe('yyyy-mm-dd hh')
      expect(adapter.formatNumber('1234')).toBe('1,234')
      expect(adapter.formatNumber('1234')).toBe('1,234')
      expect(adapter.getMeridiemText('am').toLowerCase()).toContain('am')
      expect(adapter.getMeridiemText('pm').toLowerCase()).toContain('pm')
      expect(new PlainDateAdapter('hu-HU').getMeridiemText('am')).toBe('AM')
      expect(new PlainDateAdapter('hu-HU').getMeridiemText('pm')).toBe('PM')
      expect(adapter.getWeekdays('long')[0]).toBe('Sunday')
      expect(adapter.getWeekdays('short')[0]).toBe('Sun')
      expect(adapter.getWeekdays()[0]).toBe('S')
    })

    it('should walk bounds, setters, and ranges', () => {
      const adapter = setup()
      const morning = adapter.parseISO('2026-02-01T09:05:06.007')
      const nextYear = adapter.parseISO('2027-03-02T10:00:00')
      const laterMonth = adapter.parseISO('2026-03-01T09:05:06')

      expect(adapter.toISO(adapter.startOfYear(morning))).toBe('2026-01-01')
      expect(adapter.endOfYear(morning).getMonth()).toBe(11)
      expect(adapter.endOfYear(morning).getDate()).toBe(31)
      expect(adapter.endOfYear(morning).getHours()).toBe(23)
      expect(adapter.addSeconds(morning, 1).getSeconds()).toBe(7)
      expect(adapter.addMinutes(morning, 1).getMinutes()).toBe(6)
      expect(adapter.addHours(morning, 1).getHours()).toBe(10)
      expect(adapter.getYear(adapter.setYear(morning, 2027))).toBe(2027)
      expect(adapter.toISO(adapter.setYear(morning, 10_000))).toBe('10000-02-01')
      expect(adapter.toISO(adapter.date(new Date(-1, 0, 1))!)).toBe('-1-01-01')
      expect(adapter.getDate(adapter.setDate(morning, 15))).toBe(15)
      expect(adapter.getHours(adapter.setHours(morning, 3))).toBe(3)
      expect(adapter.getMinutes(adapter.setMinutes(morning, 8))).toBe(8)
      expect(adapter.getSeconds(adapter.setSeconds(morning, 9))).toBe(9)
      expect(adapter.isAfter(nextYear, morning)).toBe(true)
      expect(adapter.isAfterMonth(nextYear, morning)).toBe(true)
      expect(adapter.isAfterMonth(morning, nextYear)).toBe(false)
      expect(adapter.isAfterMonth(laterMonth, morning)).toBe(true)
      expect(adapter.isAfterMonth(morning, laterMonth)).toBe(false)
      expect(adapter.isAfterYear(nextYear, morning)).toBe(true)
      expect(adapter.isAfterYear(morning, nextYear)).toBe(false)
      expect(adapter.isBefore(morning, nextYear)).toBe(true)
      expect(adapter.isBefore(nextYear, morning)).toBe(false)
      expect(adapter.isBeforeMonth(morning, nextYear)).toBe(true)
      expect(adapter.isBeforeMonth(morning, laterMonth)).toBe(true)
      expect(adapter.isBeforeMonth(laterMonth, morning)).toBe(false)
      expect(adapter.isBeforeYear(morning, nextYear)).toBe(true)
      expect(adapter.isBeforeYear(nextYear, morning)).toBe(false)
      expect(adapter.isEqual(morning, adapter.toJsDate(morning))).toBe(true)
      expect(adapter.isEqual(morning, nextYear)).toBe(false)
      expect(adapter.isSameMonth(morning, laterMonth)).toBe(false)
      expect(adapter.isSameMonth(morning, adapter.parseISO('2026-02-15'))).toBe(true)
      expect(adapter.isSameYear(morning, laterMonth)).toBe(true)
      expect(adapter.isSameYear(morning, nextYear)).toBe(false)
      expect(adapter.isSameHour(morning, adapter.parseISO('2026-02-01T09:30:00'))).toBe(true)
      expect(adapter.isSameHour(morning, nextYear)).toBe(false)
      expect(adapter.isWithinRange(morning, [adapter.parseISO('2026-01-01'), adapter.parseISO('2026-03-01')])).toBe(true)
      expect(adapter.isWithinRange(nextYear, [morning, laterMonth])).toBe(false)
      expect(adapter.getYear(morning)).toBe(2026)
      expect(adapter.getMonth(morning)).toBe(1)
      expect(adapter.getDate(morning)).toBe(1)
      expect(adapter.getHours(morning)).toBe(9)
      expect(adapter.getMinutes(morning)).toBe(5)
      expect(adapter.getSeconds(morning)).toBe(6)
      expect(adapter.getMonthArray(morning)).toHaveLength(12)
      expect(adapter.toISO(adapter.getMonthArray(morning)[0]!)).toBe('2026-01-01')
      expect(adapter.toISO(adapter.getMonthArray(morning)[11]!)).toBe('2026-12-01')
      expect(adapter.getYearRange(morning, nextYear)).toHaveLength(2)
      expect(adapter.toISO(adapter.getNextMonth(morning))).toBe('2026-03-01')
      expect(adapter.toISO(adapter.getPreviousMonth(morning))).toBe('2026-01-01')

      const merged = adapter.mergeDateAndTime(morning, nextYear)

      expect(adapter.toISO(merged)).toBe('2026-02-01')
      expect(merged.getHours()).toBe(10)
      expect(merged.getMinutes()).toBe(0)
    })

    it('should diff minutes, seconds, and a same-hour month span', () => {
      const adapter = setup()
      const morning = adapter.parseISO('2026-02-01T09:05:06')
      const afternoon = adapter.parseISO('2026-02-01T15:05:06')

      expect(adapter.getDiff(afternoon, morning, 'minutes')).toBe(360)
      expect(adapter.getDiff(afternoon, morning, 'seconds')).toBe(21_600)
      expect(adapter.getDiff(morning, 'not-a-date', 'days')).toBe(0)
      expect(adapter.getDiff(afternoon, '2026-02-01T15:05:06', 'minutes')).toBe(0)
      expect(adapter.getDiff(
        adapter.parseISO('2024-03-20T10:30:00'),
        adapter.parseISO('2024-01-20T10:00:00'),
        'months',
      )).toBe(2)
      expect(adapter.getDiff(
        adapter.parseISO('2024-03-20T10:00:00.500'),
        adapter.parseISO('2024-01-20T10:00:00.100'),
        'months',
      )).toBe(2)
    })
  })
})
