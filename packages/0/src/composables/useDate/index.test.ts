import { describe, it, expect, beforeEach } from 'vitest'
import { Temporal } from '@js-temporal/polyfill'
import { createDate, createDateContext, createDateFallback, createDatePlugin, useDate } from './index'
import { V0DateAdapter } from './adapters/v0'

describe('useDate', () => {
  describe('V0DateAdapter', () => {
    let adapter: V0DateAdapter

    beforeEach(() => {
      adapter = new V0DateAdapter('en-US')
    })

    describe('construction and conversion', () => {
      it('should create date from null (returns now)', () => {
        const date = adapter.date()

        expect(date).toBeDefined()
        expect(date).not.toBeNull()
      })

      it('should create date from PlainDateTime', () => {
        const input = Temporal.PlainDateTime.from('2024-06-15T10:30:00')
        const date = adapter.date(input)

        expect(date).toBe(input)
      })

      it('should create date from PlainDate', () => {
        const input = Temporal.PlainDate.from('2024-06-15')
        const date = adapter.date(input)

        expect(date).not.toBeNull()
        expect(date!.year).toBe(2024)
        expect(date!.month).toBe(6)
        expect(date!.day).toBe(15)
      })

      it('should create date from JavaScript Date', () => {
        const jsDate = new Date(2024, 5, 15, 10, 30, 0) // June 15, 2024
        const date = adapter.date(jsDate)

        expect(date).not.toBeNull()
        expect(date!.year).toBe(2024)
        expect(date!.month).toBe(6)
        expect(date!.day).toBe(15)
        expect(date!.hour).toBe(10)
        expect(date!.minute).toBe(30)
      })

      it('should create date from ISO string', () => {
        const date = adapter.date('2024-06-15T10:30:00')

        expect(date).not.toBeNull()
        expect(date!.year).toBe(2024)
        expect(date!.month).toBe(6)
        expect(date!.day).toBe(15)
      })

      it('should create date from timestamp', () => {
        const timestamp = new Date(2024, 5, 15, 10, 30, 0).getTime()
        const date = adapter.date(timestamp)

        expect(date).not.toBeNull()
        expect(date!.year).toBe(2024)
        expect(date!.month).toBe(6)
        expect(date!.day).toBe(15)
      })

      it('should return null for invalid input', () => {
        const date = adapter.date('invalid-date')

        expect(date).toBeNull()
      })

      it('should convert to JavaScript Date', () => {
        const temporal = Temporal.PlainDateTime.from('2024-06-15T10:30:00')
        const jsDate = adapter.toJsDate(temporal)

        expect(jsDate).toBeInstanceOf(Date)
        expect(jsDate.getFullYear()).toBe(2024)
        expect(jsDate.getMonth()).toBe(5) // 0-indexed
        expect(jsDate.getDate()).toBe(15)
      })

      it('should parse ISO string', () => {
        const date = adapter.parseISO('2024-06-15T10:30:00')

        expect(date.year).toBe(2024)
        expect(date.month).toBe(6)
        expect(date.day).toBe(15)
      })

      it('should parse date-only ISO string', () => {
        const date = adapter.parseISO('2024-06-15')

        expect(date.year).toBe(2024)
        expect(date.month).toBe(6)
        expect(date.day).toBe(15)
        expect(date.hour).toBe(0)
      })

      it('should convert to ISO string', () => {
        const date = Temporal.PlainDateTime.from('2024-06-15T10:30:00')
        const iso = adapter.toISO(date)

        expect(iso).toBe('2024-06-15T10:30:00')
      })

      it('should validate dates', () => {
        expect(adapter.isValid(Temporal.PlainDateTime.from('2024-06-15T10:30:00'))).toBe(true)
        expect(adapter.isValid(Temporal.PlainDate.from('2024-06-15'))).toBe(true)
        expect(adapter.isValid(new Date())).toBe(true)
        expect(adapter.isValid('2024-06-15')).toBe(true)
        expect(adapter.isValid(null)).toBe(false)
        expect(adapter.isValid('invalid')).toBe(false)
      })
    })

    describe('formatting', () => {
      const testDate = Temporal.PlainDateTime.from('2024-06-15T10:30:45')

      it('should format with preset formats', () => {
        const year = adapter.format(testDate, 'year')

        expect(year).toBe('2024')
      })

      it('should format dayOfMonth', () => {
        const day = adapter.format(testDate, 'dayOfMonth')

        expect(day).toBe('15')
      })

      it('should format with locale', () => {
        const frAdapter = new V0DateAdapter('fr-FR')
        const month = frAdapter.format(testDate, 'month')

        expect(month.toLowerCase()).toContain('juin')
      })
    })

    describe('navigation - start/end boundaries', () => {
      const testDate = Temporal.PlainDateTime.from('2024-06-15T10:30:45')

      it('should get start of day', () => {
        const start = adapter.startOfDay(testDate)

        expect(start.hour).toBe(0)
        expect(start.minute).toBe(0)
        expect(start.second).toBe(0)
        expect(start.day).toBe(15)
      })

      it('should get end of day', () => {
        const end = adapter.endOfDay(testDate)

        expect(end.hour).toBe(23)
        expect(end.minute).toBe(59)
        expect(end.second).toBe(59)
        expect(end.day).toBe(15)
      })

      it('should get start of week (Sunday first)', () => {
        // June 15, 2024 is a Saturday
        const start = adapter.startOfWeek(testDate, 0)

        expect(start.day).toBe(9) // Sunday, June 9
        expect(start.hour).toBe(0)
      })

      it('should get start of week (Monday first)', () => {
        // June 15, 2024 is a Saturday
        const start = adapter.startOfWeek(testDate, 1)

        expect(start.day).toBe(10) // Monday, June 10
      })

      it('should get end of week', () => {
        const end = adapter.endOfWeek(testDate)

        expect(end.day).toBe(15) // Saturday, June 15
        expect(end.hour).toBe(23)
      })

      it('should get start of month', () => {
        const start = adapter.startOfMonth(testDate)

        expect(start.day).toBe(1)
        expect(start.month).toBe(6)
        expect(start.hour).toBe(0)
      })

      it('should get end of month', () => {
        const end = adapter.endOfMonth(testDate)

        expect(end.day).toBe(30) // June has 30 days
        expect(end.month).toBe(6)
        expect(end.hour).toBe(23)
      })

      it('should get start of year', () => {
        const start = adapter.startOfYear(testDate)

        expect(start.month).toBe(1)
        expect(start.day).toBe(1)
        expect(start.year).toBe(2024)
      })

      it('should get end of year', () => {
        const end = adapter.endOfYear(testDate)

        expect(end.month).toBe(12)
        expect(end.day).toBe(31)
        expect(end.year).toBe(2024)
      })
    })

    describe('arithmetic', () => {
      const testDate = Temporal.PlainDateTime.from('2024-06-15T10:30:00')

      it('should add minutes', () => {
        const result = adapter.addMinutes(testDate, 15)

        expect(result.minute).toBe(45)
      })

      it('should add hours', () => {
        const result = adapter.addHours(testDate, 2)

        expect(result.hour).toBe(12)
      })

      it('should add days', () => {
        const result = adapter.addDays(testDate, 5)

        expect(result.day).toBe(20)
      })

      it('should add weeks', () => {
        const result = adapter.addWeeks(testDate, 1)

        expect(result.day).toBe(22)
      })

      it('should add months', () => {
        const result = adapter.addMonths(testDate, 2)

        expect(result.month).toBe(8) // August
      })

      it('should handle negative amounts', () => {
        const result = adapter.addDays(testDate, -5)

        expect(result.day).toBe(10)
      })
    })

    describe('comparison', () => {
      const dateA = Temporal.PlainDateTime.from('2024-06-15T10:30:00')
      const dateB = Temporal.PlainDateTime.from('2024-06-15T14:00:00')
      const dateC = Temporal.PlainDateTime.from('2024-06-20T10:30:00')

      it('should check isAfter', () => {
        expect(adapter.isAfter(dateB, dateA)).toBe(true)
        expect(adapter.isAfter(dateA, dateB)).toBe(false)
      })

      it('should check isAfterDay', () => {
        expect(adapter.isAfterDay(dateC, dateA)).toBe(true)
        expect(adapter.isAfterDay(dateB, dateA)).toBe(false) // same day
      })

      it('should check isBefore', () => {
        expect(adapter.isBefore(dateA, dateB)).toBe(true)
        expect(adapter.isBefore(dateB, dateA)).toBe(false)
      })

      it('should check isEqual', () => {
        const dateACopy = Temporal.PlainDateTime.from('2024-06-15T10:30:00')

        expect(adapter.isEqual(dateA, dateACopy)).toBe(true)
        expect(adapter.isEqual(dateA, dateB)).toBe(false)
      })

      it('should check isSameDay', () => {
        expect(adapter.isSameDay(dateA, dateB)).toBe(true)
        expect(adapter.isSameDay(dateA, dateC)).toBe(false)
      })

      it('should check isSameMonth', () => {
        expect(adapter.isSameMonth(dateA, dateC)).toBe(true)

        const july = Temporal.PlainDateTime.from('2024-07-15T10:30:00')

        expect(adapter.isSameMonth(dateA, july)).toBe(false)
      })

      it('should check isSameYear', () => {
        expect(adapter.isSameYear(dateA, dateC)).toBe(true)

        const nextYear = Temporal.PlainDateTime.from('2025-06-15T10:30:00')

        expect(adapter.isSameYear(dateA, nextYear)).toBe(false)
      })

      it('should check isWithinRange', () => {
        const start = Temporal.PlainDateTime.from('2024-06-10T00:00:00')
        const end = Temporal.PlainDateTime.from('2024-06-20T23:59:59')

        expect(adapter.isWithinRange(dateA, [start, end])).toBe(true)

        const outside = Temporal.PlainDateTime.from('2024-07-01T10:00:00')

        expect(adapter.isWithinRange(outside, [start, end])).toBe(false)
      })
    })

    describe('getters and setters', () => {
      const testDate = Temporal.PlainDateTime.from('2024-06-15T10:30:45')

      it('should get year', () => {
        expect(adapter.getYear(testDate)).toBe(2024)
      })

      it('should get month (0-indexed)', () => {
        expect(adapter.getMonth(testDate)).toBe(5) // 0-indexed
      })

      it('should get date', () => {
        expect(adapter.getDate(testDate)).toBe(15)
      })

      it('should get hours', () => {
        expect(adapter.getHours(testDate)).toBe(10)
      })

      it('should get minutes', () => {
        expect(adapter.getMinutes(testDate)).toBe(30)
      })

      it('should set year (immutable)', () => {
        const result = adapter.setYear(testDate, 2025)

        expect(result.year).toBe(2025)
        expect(testDate.year).toBe(2024) // original unchanged
      })

      it('should set month (0-indexed input)', () => {
        const result = adapter.setMonth(testDate, 0) // January

        expect(result.month).toBe(1)
      })

      it('should set date', () => {
        const result = adapter.setDate(testDate, 20)

        expect(result.day).toBe(20)
      })

      it('should set hours', () => {
        const result = adapter.setHours(testDate, 14)

        expect(result.hour).toBe(14)
      })

      it('should set minutes', () => {
        const result = adapter.setMinutes(testDate, 45)

        expect(result.minute).toBe(45)
      })
    })

    describe('week utilities', () => {
      const testDate = Temporal.PlainDateTime.from('2024-06-15T10:30:00')

      it('should get weekdays', () => {
        const weekdays = adapter.getWeekdays(0, 'short')

        expect(weekdays).toHaveLength(7)
        expect(weekdays[0]).toBe('Sun')
        expect(weekdays[6]).toBe('Sat')
      })

      it('should get weekdays with Monday first', () => {
        const weekdays = adapter.getWeekdays(1, 'short')

        expect(weekdays[0]).toBe('Mon')
        expect(weekdays[6]).toBe('Sun')
      })

      it('should get week array', () => {
        const weeks = adapter.getWeekArray(testDate, 0)

        expect(weeks.length).toBeGreaterThanOrEqual(4)
        expect(weeks.length).toBeLessThanOrEqual(6)

        for (const week of weeks) {
          expect(week).toHaveLength(7)
        }
      })

      it('should get diff in days', () => {
        const dateA = Temporal.PlainDateTime.from('2024-06-15T10:00:00')
        const dateB = Temporal.PlainDateTime.from('2024-06-10T10:00:00')
        const diff = adapter.getDiff(dateA, dateB, 'days')

        expect(diff).toBe(5)
      })

      it('should get week number for date', () => {
        const week = adapter.getWeek(testDate)

        expect(typeof week).toBe('number')
        expect(week).toBeGreaterThanOrEqual(1)
        expect(week).toBeLessThanOrEqual(53)
      })

      it('should respect firstDayOfWeek parameter in getWeek', () => {
        const jan1 = Temporal.PlainDateTime.from('2024-01-01T10:00:00')
        const weekSunday = adapter.getWeek(jan1, 0)
        const weekMonday = adapter.getWeek(jan1, 1)

        expect(typeof weekSunday).toBe('number')
        expect(typeof weekMonday).toBe('number')
        expect(weekSunday).toBeGreaterThanOrEqual(1)
        expect(weekMonday).toBeGreaterThanOrEqual(1)
      })

      it('should respect minimalDays parameter in getWeek', () => {
        const jan1 = Temporal.PlainDateTime.from('2024-01-01T10:00:00')
        const week1Day = adapter.getWeek(jan1, 0, 1)
        const week4Day = adapter.getWeek(jan1, 0, 4)

        expect(typeof week1Day).toBe('number')
        expect(typeof week4Day).toBe('number')
      })

      it('should return correct week for mid-year date', () => {
        // June 15, 2024 is in week 24 or 25 depending on calculation
        const week = adapter.getWeek(testDate, 0)

        expect(week).toBeGreaterThan(20)
        expect(week).toBeLessThan(30)
      })

      it('should handle year boundary weeks', () => {
        const dec31 = Temporal.PlainDateTime.from('2024-12-31T10:00:00')
        const jan1 = Temporal.PlainDateTime.from('2025-01-01T10:00:00')

        const weekDec = adapter.getWeek(dec31)
        const weekJan = adapter.getWeek(jan1)

        expect(weekDec).toBeGreaterThanOrEqual(1)
        expect(weekJan).toBeGreaterThanOrEqual(1)
      })
    })

    describe('month navigation', () => {
      const testDate = Temporal.PlainDateTime.from('2024-06-15T10:30:00')

      it('should get next month', () => {
        const next = adapter.getNextMonth(testDate)

        expect(next.month).toBe(7)
        expect(next.day).toBe(1)
        expect(next.hour).toBe(0)
      })

      it('should get previous month', () => {
        const prev = adapter.getPreviousMonth(testDate)

        expect(prev.month).toBe(5)
        expect(prev.day).toBe(1)
      })

      it('should handle year boundary (December to January)', () => {
        const december = Temporal.PlainDateTime.from('2024-12-15T10:30:00')
        const next = adapter.getNextMonth(december)

        expect(next.year).toBe(2025)
        expect(next.month).toBe(1)
      })

      it('should handle year boundary (January to December)', () => {
        const january = Temporal.PlainDateTime.from('2024-01-15T10:30:00')
        const prev = adapter.getPreviousMonth(january)

        expect(prev.year).toBe(2023)
        expect(prev.month).toBe(12)
      })
    })

    // ============================================
    // date-io parity tests (new methods)
    // ============================================

    describe('isNull', () => {
      it('should return true for null', () => {
        expect(adapter.isNull(null)).toBe(true)
      })

      it('should return false for valid date', () => {
        const date = adapter.date('2024-06-15T10:30:00')!
        expect(adapter.isNull(date)).toBe(false)
      })
    })

    describe('parse', () => {
      it('should parse valid date string', () => {
        const date = adapter.parse('2024-06-15T10:30:00', 'YYYY-MM-DD')
        expect(date).not.toBeNull()
        expect(date!.year).toBe(2024)
      })

      it('should return null for invalid string', () => {
        const date = adapter.parse('not-a-date', 'YYYY-MM-DD')
        expect(date).toBeNull()
      })
    })

    describe('locale methods', () => {
      it('should get current locale code', () => {
        expect(adapter.getCurrentLocaleCode()).toBe('en-US')
      })

      it('should detect 12-hour cycle', () => {
        const usAdapter = new V0DateAdapter('en-US')
        expect(usAdapter.is12HourCycleInCurrentLocale()).toBe(true)

        const deAdapter = new V0DateAdapter('de-DE')
        expect(deAdapter.is12HourCycleInCurrentLocale()).toBe(false)
      })

      it('should format by string with tokens', () => {
        const date = adapter.date('2024-06-15T10:30:45')!
        const formatted = adapter.formatByString(date, 'YYYY-MM-DD HH:mm:ss')
        expect(formatted).toBe('2024-06-15 10:30:45')
      })

      it('should format by string with 12h time', () => {
        const date = adapter.date('2024-06-15T14:30:00')!
        const formatted = adapter.formatByString(date, 'hh:mm A')
        expect(formatted).toBe('02:30 PM')
      })

      it('should get format helper text', () => {
        expect(adapter.getFormatHelperText('keyboardDate')).toBe('mm/dd/yyyy')
      })

      it('should format number according to locale', () => {
        expect(adapter.formatNumber('1234')).toBe('1,234')
      })

      it('should get meridiem text', () => {
        expect(adapter.getMeridiemText('am').toLowerCase()).toContain('am')
        expect(adapter.getMeridiemText('pm').toLowerCase()).toContain('pm')
      })
    })

    describe('additional arithmetic', () => {
      const testDate = Temporal.PlainDateTime.from('2024-06-15T10:30:45')

      it('should add seconds', () => {
        const result = adapter.addSeconds(testDate, 30)
        expect(result.second).toBe(15) // 45 + 30 = 75, wraps to 15
        expect(result.minute).toBe(31)
      })

      it('should add years', () => {
        const result = adapter.addYears(testDate, 2)
        expect(result.year).toBe(2026)
      })

      it('should subtract years', () => {
        const result = adapter.addYears(testDate, -3)
        expect(result.year).toBe(2021)
      })
    })

    describe('additional comparisons', () => {
      const june2024 = Temporal.PlainDateTime.from('2024-06-15T10:30:00')
      const july2024 = Temporal.PlainDateTime.from('2024-07-15T10:30:00')
      const june2025 = Temporal.PlainDateTime.from('2025-06-15T10:30:00')
      const sameHour = Temporal.PlainDateTime.from('2024-06-15T10:45:00')
      const diffHour = Temporal.PlainDateTime.from('2024-06-15T11:30:00')

      it('should check isAfterMonth', () => {
        expect(adapter.isAfterMonth(july2024, june2024)).toBe(true)
        expect(adapter.isAfterMonth(june2024, july2024)).toBe(false)
        expect(adapter.isAfterMonth(june2025, june2024)).toBe(true)
      })

      it('should check isAfterYear', () => {
        expect(adapter.isAfterYear(june2025, june2024)).toBe(true)
        expect(adapter.isAfterYear(june2024, june2025)).toBe(false)
      })

      it('should check isBeforeDay', () => {
        expect(adapter.isBeforeDay(june2024, july2024)).toBe(true)
        expect(adapter.isBeforeDay(july2024, june2024)).toBe(false)
      })

      it('should check isBeforeMonth', () => {
        expect(adapter.isBeforeMonth(june2024, july2024)).toBe(true)
        expect(adapter.isBeforeMonth(july2024, june2024)).toBe(false)
      })

      it('should check isBeforeYear', () => {
        expect(adapter.isBeforeYear(june2024, june2025)).toBe(true)
        expect(adapter.isBeforeYear(june2025, june2024)).toBe(false)
      })

      it('should check isSameHour', () => {
        expect(adapter.isSameHour(june2024, sameHour)).toBe(true)
        expect(adapter.isSameHour(june2024, diffHour)).toBe(false)
      })
    })

    describe('seconds getter/setter', () => {
      const testDate = Temporal.PlainDateTime.from('2024-06-15T10:30:45')

      it('should get seconds', () => {
        expect(adapter.getSeconds(testDate)).toBe(45)
      })

      it('should set seconds', () => {
        const result = adapter.setSeconds(testDate, 30)
        expect(result.second).toBe(30)
      })
    })

    describe('getDaysInMonth', () => {
      it('should return days in month', () => {
        const june = adapter.date('2024-06-15')!
        expect(adapter.getDaysInMonth(june)).toBe(30)

        const july = adapter.date('2024-07-15')!
        expect(adapter.getDaysInMonth(july)).toBe(31)

        const feb2024 = adapter.date('2024-02-15')! // leap year
        expect(adapter.getDaysInMonth(feb2024)).toBe(29)

        const feb2023 = adapter.date('2023-02-15')! // non-leap year
        expect(adapter.getDaysInMonth(feb2023)).toBe(28)
      })
    })

    describe('getMonthArray', () => {
      it('should return array of 12 months', () => {
        const date = adapter.date('2024-06-15')!
        const months = adapter.getMonthArray(date)

        expect(months).toHaveLength(12)
        expect(months[0]!.month).toBe(1) // January
        expect(months[11]!.month).toBe(12) // December
        expect(months[0]!.year).toBe(2024)
      })
    })

    describe('getYearRange', () => {
      it('should return array of years', () => {
        const start = adapter.date('2020-01-01')!
        const end = adapter.date('2024-12-31')!
        const years = adapter.getYearRange(start, end)

        expect(years).toHaveLength(5)
        expect(years[0]!.year).toBe(2020)
        expect(years[4]!.year).toBe(2024)
      })
    })

    describe('mergeDateAndTime', () => {
      it('should merge date from one value with time from another', () => {
        const date = adapter.date('2024-06-15T00:00:00')!
        const time = adapter.date('2020-01-01T14:30:45')!

        const merged = adapter.mergeDateAndTime(date, time)

        expect(merged.year).toBe(2024)
        expect(merged.month).toBe(6)
        expect(merged.day).toBe(15)
        expect(merged.hour).toBe(14)
        expect(merged.minute).toBe(30)
        expect(merged.second).toBe(45)
      })
    })

    describe('SSR behavior', () => {
      it('should return deterministic date for explicit null/undefined input', () => {
        // When calling date() without arguments in SSR, the implementation
        // returns epoch (1970-01-01) for deterministic rendering.
        // In tests (browser environment), it returns current time.
        // This test verifies the explicit value paths work correctly.
        const explicitNull = adapter.date(null)
        const explicitUndefined = adapter.date(undefined)

        // Both should return a valid PlainDateTime (not null)
        expect(explicitNull).not.toBeNull()
        expect(explicitUndefined).not.toBeNull()

        // In happy-dom (browser), these return current time
        // The important thing is they're consistent with each other
        expect(explicitNull!.year).toBe(explicitUndefined!.year)
        expect(explicitNull!.month).toBe(explicitUndefined!.month)
        expect(explicitNull!.day).toBe(explicitUndefined!.day)
      })

      it('should return current time in browser environment', () => {
        // Default test environment has IN_BROWSER = true (happy-dom)
        const date = adapter.date()
        const now = new Date()

        expect(date).not.toBeNull()
        // Should be close to current time (within 1 second)
        expect(date!.year).toBe(now.getFullYear())
        expect(date!.month).toBe(now.getMonth() + 1)
        expect(date!.day).toBe(now.getDate())
      })

      it('should handle explicit timestamp input for SSR-safe current time', () => {
        // SSR apps should pass Date.now() explicitly to avoid hydration mismatch
        const timestamp = Date.now()
        const date = adapter.date(timestamp)

        expect(date).not.toBeNull()
        const jsDate = new Date(timestamp)
        expect(date!.year).toBe(jsDate.getFullYear())
        expect(date!.month).toBe(jsDate.getMonth() + 1)
        expect(date!.day).toBe(jsDate.getDate())
      })
    })

    describe('cache management', () => {
      it('should handle many format calls without memory issues', () => {
        const testAdapter = new V0DateAdapter('en-US')
        const testDate = Temporal.PlainDateTime.from('2024-06-15T10:30:00')

        // Call format many times with different presets
        // This exercises the cache without using invalid locales
        const presets = [
          'fullDate', 'shortDate', 'normalDate', 'year', 'month',
          'monthShort', 'monthAndYear', 'monthAndDate', 'weekday',
          'weekdayShort', 'dayOfMonth', 'hours12h', 'hours24h',
          'minutes', 'seconds', 'fullTime', 'fullTime12h', 'fullTime24h',
          'fullDateTime', 'keyboardDate', 'keyboardDateTime',
        ]

        // Call each preset multiple times
        for (let i = 0; i < 100; i++) {
          const preset = presets[i % presets.length]!
          testAdapter.format(testDate, preset)
        }

        // Should still work correctly after many calls
        expect(testAdapter.format(testDate, 'fullDate')).toBeDefined()
        expect(testAdapter.format(testDate, 'shortDate')).toBeDefined()
      })

      it('should reuse cached formatters for same locale and options', () => {
        const testAdapter = new V0DateAdapter('en-US')
        const testDate = Temporal.PlainDateTime.from('2024-06-15T10:30:00')

        // Call format multiple times with same parameters
        const result1 = testAdapter.format(testDate, 'fullDate')
        const result2 = testAdapter.format(testDate, 'fullDate')
        const result3 = testAdapter.format(testDate, 'fullDate')

        // All results should be identical (using cached formatter)
        expect(result1).toBe(result2)
        expect(result2).toBe(result3)
      })

      it('should create different formatters for different locales', () => {
        const usAdapter = new V0DateAdapter('en-US')
        const deAdapter = new V0DateAdapter('de-DE')
        const testDate = Temporal.PlainDateTime.from('2024-06-15T10:30:00')

        const usResult = usAdapter.format(testDate, 'month')
        const deResult = deAdapter.format(testDate, 'month')

        // Different locales should produce different output
        expect(usResult.toLowerCase()).toContain('june')
        expect(deResult.toLowerCase()).toContain('juni')
      })
    })
  })

  describe('createDate', () => {
    it('should create date context with default options', () => {
      const dateContext = createDate()

      expect(dateContext).toBeDefined()
      expect(dateContext.adapter).toBeDefined()
      expect(dateContext.locale).toBeDefined()
    })

    it('should create date context with custom adapter', () => {
      const customAdapter = new V0DateAdapter('de-DE')
      const dateContext = createDate({ adapter: customAdapter })

      expect(dateContext.adapter).toBe(customAdapter)
    })

    it('should use specified locale', () => {
      const dateContext = createDate({ locale: 'fr-FR' })

      expect(dateContext.locale.value).toBe('fr-FR')
    })

    it('should auto-detect Intl locale (with hyphen)', () => {
      // Locales with region codes should be used directly
      const dateContext = createDate({ locale: 'en-US' })

      expect(dateContext.locale.value).toBe('en-US')
    })

    it('should map short locale codes to Intl locales', () => {
      // Short codes without region should use localeMap
      const dateContext = createDate({ locale: 'en' })

      expect(dateContext.locale.value).toBe('en-US') // from defaultLocaleMap
    })

    it('should allow custom localeMap for short codes', () => {
      const dateContext = createDate({
        locale: 'en',
        localeMap: { en: 'en-GB' },
      })

      expect(dateContext.locale.value).toBe('en-GB')
    })

    it('should not apply localeMap to full Intl locales', () => {
      // Even with a localeMap, full Intl locales should be used directly
      const dateContext = createDate({
        locale: 'en-US',
        localeMap: { 'en-US': 'en-GB' }, // This should be ignored
      })

      expect(dateContext.locale.value).toBe('en-US')
    })
  })

  describe('createDatePlugin', () => {
    it('should create a Vue plugin', () => {
      const plugin = createDatePlugin()

      expect(plugin).toBeDefined()
      expect(typeof plugin.install).toBe('function')
    })

    it('should accept date options', () => {
      const plugin = createDatePlugin({
        locale: 'de-DE',
      })

      expect(plugin).toBeDefined()
      expect(typeof plugin.install).toBe('function')
    })

    it('should accept custom adapter', () => {
      const customAdapter = new V0DateAdapter('ja-JP')
      const plugin = createDatePlugin({
        adapter: customAdapter,
      })

      expect(plugin).toBeDefined()
    })

    it('should accept custom namespace', () => {
      const plugin = createDatePlugin({
        namespace: 'my-app:date',
      })

      expect(plugin).toBeDefined()
    })
  })

  describe('createDateContext', () => {
    it('should return trinity tuple [useContext, provideContext, defaultContext]', () => {
      const trinity = createDateContext()

      expect(trinity).toHaveLength(3)
      expect(typeof trinity[0]).toBe('function') // useContext
      expect(typeof trinity[1]).toBe('function') // provideContext
      expect(trinity[2]).toBeDefined() // defaultContext
    })

    it('should return date context with default adapter', () => {
      const [, , context] = createDateContext()

      expect(context).toBeDefined()
      expect(context.adapter).toBeDefined()
      expect(context.locale).toBeDefined()
    })

    it('should preserve custom adapter in trinity', () => {
      const customAdapter = new V0DateAdapter('ja-JP')
      const [, , context] = createDateContext({ adapter: customAdapter })

      expect(context.adapter).toBe(customAdapter)
    })

    it('should create independent contexts with different namespaces', () => {
      const ctx1 = createDateContext({ namespace: 'app:date1' })
      const ctx2 = createDateContext({ namespace: 'app:date2' })

      // Both should return valid trinities
      expect(ctx1).toHaveLength(3)
      expect(ctx2).toHaveLength(3)

      // Default contexts should be independent instances
      expect(ctx1[2]).not.toBe(ctx2[2])
    })

    it('should apply locale option', () => {
      const [, , context] = createDateContext({ locale: 'de-DE' })

      expect(context.locale.value).toBe('de-DE')
    })

    it('should apply localeMap in trinity', () => {
      const [, , context] = createDateContext({
        locale: 'de',
        localeMap: { de: 'de-CH' },
      })

      expect(context.locale.value).toBe('de-CH')
    })

    it('should use default namespace when not specified', () => {
      const trinity = createDateContext()

      // Should not throw - uses default 'v0:date' namespace
      expect(trinity).toBeDefined()
    })

    it('should accept custom namespace', () => {
      const trinity = createDateContext({ namespace: 'custom:date' })

      expect(trinity).toBeDefined()
      expect(trinity).toHaveLength(3)
    })

    it('should create functional context for date operations', () => {
      const [, , context] = createDateContext()
      const date = context.adapter.date('2024-06-15T10:30:00')

      expect(date).not.toBeNull()
      expect(date!.year).toBe(2024)
      expect(date!.month).toBe(6)
    })
  })

  describe('createDateFallback', () => {
    it('should return a valid date context without Vue component', () => {
      // createDateFallback works outside of Vue component lifecycle
      const fallback = createDateFallback()

      expect(fallback).toBeDefined()
      expect(fallback.adapter).toBeInstanceOf(V0DateAdapter)
      expect(fallback.locale).toBeDefined()
      expect(fallback.locale.value).toBe('en-US')
    })

    it('should create functional adapter for date operations', () => {
      const fallback = createDateFallback()
      const date = fallback.adapter.date('2024-06-15T10:30:00')

      expect(date).not.toBeNull()
      expect(date!.year).toBe(2024)
      expect(date!.month).toBe(6)
    })
  })

  describe('locale synchronization', () => {
    it('should sync adapter locale with computed locale', () => {
      const customAdapter = new V0DateAdapter('en-US')
      const dateContext = createDate({
        adapter: customAdapter,
        locale: 'de-DE',
      })

      // The computed locale should be 'de-DE'
      expect(dateContext.locale.value).toBe('de-DE')
      // The adapter locale should be synced via watchEffect
      expect(customAdapter.locale).toBe('de-DE')
    })

    it('should apply localeMap when short code is provided', () => {
      const customAdapter = new V0DateAdapter('en-US')
      const dateContext = createDate({
        adapter: customAdapter,
        locale: 'fr', // short code
        localeMap: { fr: 'fr-CA' },
      })

      expect(dateContext.locale.value).toBe('fr-CA')
      expect(customAdapter.locale).toBe('fr-CA')
    })
  })

  describe('useDate', () => {
    it('should return fallback when called outside component', () => {
      const ctx = useDate()

      expect(ctx).toBeDefined()
      expect(ctx.adapter).toBeInstanceOf(V0DateAdapter)
      expect(ctx.locale.value).toBe('en-US')
    })

    it('should return fallback with custom namespace outside component', () => {
      const ctx = useDate('custom:namespace')

      expect(ctx).toBeDefined()
      expect(ctx.adapter).toBeInstanceOf(V0DateAdapter)
    })

    it('should handle missing context gracefully', () => {
      // useDate catches errors and returns fallback
      const ctx = useDate('nonexistent:namespace')

      expect(ctx).toBeDefined()
      expect(ctx.adapter).toBeInstanceOf(V0DateAdapter)
    })
  })
})
