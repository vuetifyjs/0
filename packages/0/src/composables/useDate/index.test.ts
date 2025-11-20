/**
 * Tests for useDate composable and TemporalAdapter
 */

import { describe, it, expect } from 'vitest'
import { Temporal } from '@js-temporal/polyfill'
import { createDate, defaultDate, TemporalAdapter, TemporalDateTimeAdapter } from './index'

describe('TemporalAdapter', () => {
  const adapter = new TemporalAdapter({ locale: 'en-US' })

  describe('date creation and conversion', () => {
    it('should create current date when called with no arguments', () => {
      const result = adapter.date()
      expect(result).toBeInstanceOf(Temporal.PlainDate)
    })

    it('should handle Temporal.PlainDate instances', () => {
      const date = Temporal.PlainDate.from('2023-11-30')
      const result = adapter.date(date)
      expect(result).toBe(date)
    })

    it('should parse ISO strings', () => {
      const result = adapter.date('2023-11-30')
      expect(result).toBeInstanceOf(Temporal.PlainDate)
      expect(adapter.toISO(result!)).toBe('2023-11-30')
    })

    it('should convert JavaScript Date objects', () => {
      const jsDate = new Date('2023-11-30T00:00:00Z')
      const result = adapter.date(jsDate)
      expect(result).toBeInstanceOf(Temporal.PlainDate)
    })

    it('should convert timestamps', () => {
      const timestamp = new Date('2023-11-30').getTime()
      const result = adapter.date(timestamp)
      expect(result).toBeInstanceOf(Temporal.PlainDate)
    })

    it('should return null for invalid inputs', () => {
      expect(adapter.date('invalid')).toBeNull()
      expect(adapter.date({})).toBeNull()
    })

    it('should convert to JavaScript Date', () => {
      const plainDate = Temporal.PlainDate.from('2023-11-30')
      const result = adapter.toJsDate(plainDate)
      expect(result).toBeInstanceOf(Date)
    })

    it('should convert to ISO string', () => {
      const plainDate = Temporal.PlainDate.from('2023-11-30')
      expect(adapter.toISO(plainDate)).toBe('2023-11-30')
    })

    it('should parse ISO strings with time', () => {
      const result = adapter.parseISO('2023-11-30T12:00:00Z')
      expect(result).toBeInstanceOf(Temporal.PlainDate)
      expect(adapter.toISO(result)).toBe('2023-11-30')
    })
  })

  describe('arithmetic operations', () => {
    const baseDate = Temporal.PlainDate.from('2023-11-30')

    it('should add days', () => {
      const result = adapter.addDays(baseDate, 5)
      expect(adapter.toISO(result)).toBe('2023-12-05')
    })

    it('should subtract days with negative amount', () => {
      const result = adapter.addDays(baseDate, -5)
      expect(adapter.toISO(result)).toBe('2023-11-25')
    })

    it('should add weeks', () => {
      const result = adapter.addWeeks(baseDate, 2)
      expect(adapter.toISO(result)).toBe('2023-12-14')
    })

    it('should add months', () => {
      const result = adapter.addMonths(baseDate, 2)
      expect(adapter.toISO(result)).toBe('2024-01-30')
    })

    it('should handle month overflow correctly', () => {
      const jan31 = Temporal.PlainDate.from('2023-01-31')
      const result = adapter.addMonths(jan31, 1)
      // Temporal constrains to last day of month
      expect(adapter.toISO(result)).toBe('2023-02-28')
    })

    it('should add hours (no-op for PlainDate)', () => {
      const result = adapter.addHours(baseDate, 5)
      expect(adapter.toISO(result)).toBe('2023-11-30')
    })

    it('should add minutes (no-op for PlainDate)', () => {
      const result = adapter.addMinutes(baseDate, 30)
      expect(adapter.toISO(result)).toBe('2023-11-30')
    })
  })

  describe('date boundaries', () => {
    const date = Temporal.PlainDate.from('2023-11-15')

    it('should return start of day (no-op for PlainDate)', () => {
      const result = adapter.startOfDay(date)
      expect(result).toBe(date)
    })

    it('should return end of day (no-op for PlainDate)', () => {
      const result = adapter.endOfDay(date)
      expect(result).toBe(date)
    })

    it('should return start of week (Sunday)', () => {
      const result = adapter.startOfWeek(date, 0)
      expect(adapter.toISO(result)).toBe('2023-11-12') // Previous Sunday
    })

    it('should return start of week (Monday)', () => {
      const result = adapter.startOfWeek(date, 1)
      expect(adapter.toISO(result)).toBe('2023-11-13') // Previous Monday
    })

    it('should return end of week', () => {
      const result = adapter.endOfWeek(date, 0)
      expect(adapter.toISO(result)).toBe('2023-11-18') // Next Saturday
    })

    it('should return start of month', () => {
      const result = adapter.startOfMonth(date)
      expect(adapter.toISO(result)).toBe('2023-11-01')
    })

    it('should return end of month', () => {
      const result = adapter.endOfMonth(date)
      expect(adapter.toISO(result)).toBe('2023-11-30')
    })

    it('should return start of year', () => {
      const result = adapter.startOfYear(date)
      expect(adapter.toISO(result)).toBe('2023-01-01')
    })

    it('should return end of year', () => {
      const result = adapter.endOfYear(date)
      expect(adapter.toISO(result)).toBe('2023-12-31')
    })
  })

  describe('comparison', () => {
    const date1 = Temporal.PlainDate.from('2023-11-15')
    const date2 = Temporal.PlainDate.from('2023-11-20')
    const date3 = Temporal.PlainDate.from('2023-11-15')

    it('should check equality', () => {
      expect(adapter.isEqual(date1, date3)).toBe(true)
      expect(adapter.isEqual(date1, date2)).toBe(false)
    })

    it('should check if after', () => {
      expect(adapter.isAfter(date2, date1)).toBe(true)
      expect(adapter.isAfter(date1, date2)).toBe(false)
      expect(adapter.isAfter(date1, date3)).toBe(false)
    })

    it('should check if before', () => {
      expect(adapter.isBefore(date1, date2)).toBe(true)
      expect(adapter.isBefore(date2, date1)).toBe(false)
      expect(adapter.isBefore(date1, date3)).toBe(false)
    })

    it('should check if after day', () => {
      expect(adapter.isAfterDay(date2, date1)).toBe(true)
      expect(adapter.isAfterDay(date1, date2)).toBe(false)
    })

    it('should check if same day', () => {
      expect(adapter.isSameDay(date1, date3)).toBe(true)
      expect(adapter.isSameDay(date1, date2)).toBe(false)
    })

    it('should check if same month', () => {
      expect(adapter.isSameMonth(date1, date2)).toBe(true)
      const differentMonth = Temporal.PlainDate.from('2023-12-15')
      expect(adapter.isSameMonth(date1, differentMonth)).toBe(false)
    })

    it('should check if same year', () => {
      expect(adapter.isSameYear(date1, date2)).toBe(true)
      const differentYear = Temporal.PlainDate.from('2024-11-15')
      expect(adapter.isSameYear(date1, differentYear)).toBe(false)
    })

    it('should validate dates', () => {
      expect(adapter.isValid('2023-11-30')).toBe(true)
      expect(adapter.isValid('invalid')).toBe(false)
      expect(adapter.isValid(null)).toBe(false)
    })

    it('should check if within range', () => {
      const start = Temporal.PlainDate.from('2023-11-10')
      const end = Temporal.PlainDate.from('2023-11-20')
      expect(adapter.isWithinRange(date1, [start, end])).toBe(true)
      expect(adapter.isWithinRange(date2, [start, end])).toBe(true)
      const outside = Temporal.PlainDate.from('2023-11-25')
      expect(adapter.isWithinRange(outside, [start, end])).toBe(false)
    })
  })

  describe('getters', () => {
    const date = Temporal.PlainDate.from('2023-11-15')

    it('should get year', () => {
      expect(adapter.getYear(date)).toBe(2023)
    })

    it('should get month (0-indexed)', () => {
      expect(adapter.getMonth(date)).toBe(10) // November is 10 in 0-indexed
    })

    it('should get date', () => {
      expect(adapter.getDate(date)).toBe(15)
    })

    it('should get hours (always 0 for PlainDate)', () => {
      expect(adapter.getHours(date)).toBe(0)
    })

    it('should get minutes (always 0 for PlainDate)', () => {
      expect(adapter.getMinutes(date)).toBe(0)
    })

    it('should get next month', () => {
      const result = adapter.getNextMonth(date)
      expect(adapter.toISO(result)).toBe('2023-12-15')
    })

    it('should get previous month', () => {
      const result = adapter.getPreviousMonth(date)
      expect(adapter.toISO(result)).toBe('2023-10-15')
    })

    it('should get weekdays', () => {
      const weekdays = adapter.getWeekdays(0, 'long')
      expect(weekdays).toHaveLength(7)
      expect(weekdays[0]).toBe('Sunday')
      expect(weekdays[1]).toBe('Monday')
    })

    it('should get weekdays starting from Monday', () => {
      const weekdays = adapter.getWeekdays(1, 'long')
      expect(weekdays).toHaveLength(7)
      expect(weekdays[0]).toBe('Monday')
      expect(weekdays[6]).toBe('Sunday')
    })

    it('should get short weekdays', () => {
      const weekdays = adapter.getWeekdays(0, 'short')
      expect(weekdays[0]).toBe('Sun')
      expect(weekdays[1]).toBe('Mon')
    })
  })

  describe('setters', () => {
    const date = Temporal.PlainDate.from('2023-11-15')

    it('should set year', () => {
      const result = adapter.setYear(date, 2024)
      expect(adapter.toISO(result)).toBe('2024-11-15')
    })

    it('should set month (0-indexed)', () => {
      const result = adapter.setMonth(date, 0) // January
      expect(adapter.toISO(result)).toBe('2023-01-15')
    })

    it('should set date', () => {
      const result = adapter.setDate(date, 25)
      expect(adapter.toISO(result)).toBe('2023-11-25')
    })

    it('should ignore setHours (no-op for PlainDate)', () => {
      const result = adapter.setHours(date, 12)
      expect(adapter.toISO(result)).toBe('2023-11-15')
    })

    it('should ignore setMinutes (no-op for PlainDate)', () => {
      const result = adapter.setMinutes(date, 30)
      expect(adapter.toISO(result)).toBe('2023-11-15')
    })
  })

  describe('utilities', () => {
    const date = Temporal.PlainDate.from('2023-11-15')

    it('should format with predefined formats', () => {
      const result = adapter.format(date, 'fullDate')
      expect(result).toBeTruthy()
      expect(typeof result).toBe('string')
    })

    it('should fallback to ISO for unknown formats', () => {
      const result = adapter.format(date, 'unknown-format')
      expect(result).toBe('2023-11-15')
    })

    it('should calculate diff in days', () => {
      const earlier = Temporal.PlainDate.from('2023-11-10')
      const diff = adapter.getDiff(date, earlier, 'days')
      expect(diff).toBe(5)
    })

    it('should calculate diff in months', () => {
      const earlier = Temporal.PlainDate.from('2023-09-15')
      const diff = adapter.getDiff(date, earlier, 'months')
      expect(diff).toBe(2)
    })

    it('should calculate negative diff', () => {
      const later = Temporal.PlainDate.from('2023-11-20')
      const diff = adapter.getDiff(date, later, 'days')
      expect(diff).toBe(-5)
    })

    it('should get week array for month', () => {
      const weeks = adapter.getWeekArray(date, 0)
      expect(weeks.length).toBeGreaterThan(0)
      expect(weeks[0].length).toBe(7)
      // Each week should have 7 days
      weeks.forEach(week => {
        expect(week.length).toBe(7)
      })
    })
  })

  describe('locale support', () => {
    it('should respect locale in formatting', () => {
      const enAdapter = new TemporalAdapter({ locale: 'en-US' })
      const frAdapter = new TemporalAdapter({ locale: 'fr-FR' })
      const date = Temporal.PlainDate.from('2023-11-15')

      const enWeekdays = enAdapter.getWeekdays(0, 'long')
      const frWeekdays = frAdapter.getWeekdays(0, 'long')

      expect(enWeekdays[0]).toBe('Sunday')
      expect(frWeekdays[0]).toBe('dimanche')
    })
  })
})

describe('createDate', () => {
  it('should create date context with default options', () => {
    const [use, provide, context] = createDate()

    expect(typeof use).toBe('function')
    expect(typeof provide).toBe('function')
    expect(context).toBeDefined()
    expect(context.locale).toBe('en-US')
  })

  it('should create date context with custom locale', () => {
    const [, , context] = createDate({ locale: 'fr-FR' })
    expect(context.locale).toBe('fr-FR')
  })

  it('should create date context with custom namespace', () => {
    const [, , context] = createDate({ namespace: 'custom:date' })
    expect(context).toBeDefined()
  })

  it('should allow locale updates', () => {
    const [, , context] = createDate({ locale: 'en-US' })
    expect(context.locale).toBe('en-US')

    context.setLocale('fr-FR')
    expect(context.locale).toBe('fr-FR')
  })

  it('should work with custom adapter', () => {
    const customAdapter = new TemporalAdapter({ locale: 'de-DE' })
    const [, , context] = createDate({ adapter: customAdapter })

    const date = context.date('2023-11-15')
    expect(date).toBeInstanceOf(Temporal.PlainDate)
  })
})

describe('defaultDate', () => {
  it('should provide default date context', () => {
    expect(defaultDate).toBeDefined()
    expect(defaultDate.locale).toBe('en-US')
  })

  it('should perform basic operations', () => {
    const today = defaultDate.date()
    expect(today).toBeInstanceOf(Temporal.PlainDate)

    const tomorrow = defaultDate.addDays(today!, 1)
    expect(defaultDate.isAfter(tomorrow, today!)).toBe(true)
  })
})

describe('TemporalDateTimeAdapter', () => {
  const adapter = new TemporalDateTimeAdapter({ locale: 'en-US' })

  describe('time support', () => {
    it('should create current datetime when called with no arguments', () => {
      const result = adapter.date()
      expect(result).toBeInstanceOf(Temporal.PlainDateTime)
    })

    it('should handle Temporal.PlainDateTime instances', () => {
      const dt = Temporal.PlainDateTime.from('2023-11-30T14:30:00')
      const result = adapter.date(dt)
      expect(result).toBe(dt)
    })

    it('should convert PlainDate to PlainDateTime', () => {
      const date = Temporal.PlainDate.from('2023-11-30')
      const result = adapter.date(date)
      expect(result).toBeInstanceOf(Temporal.PlainDateTime)
      expect(adapter.getHours(result!)).toBe(0)
      expect(adapter.getMinutes(result!)).toBe(0)
    })

    it('should preserve time from JavaScript Date', () => {
      const jsDate = new Date(2023, 10, 30, 14, 30, 45)
      const result = adapter.date(jsDate)
      expect(adapter.getHours(result!)).toBe(14)
      expect(adapter.getMinutes(result!)).toBe(30)
    })

    it('should get and set hours', () => {
      const dt = Temporal.PlainDateTime.from('2023-11-30T14:30:00')
      expect(adapter.getHours(dt)).toBe(14)

      const updated = adapter.setHours(dt, 20)
      expect(adapter.getHours(updated)).toBe(20)
    })

    it('should get and set minutes', () => {
      const dt = Temporal.PlainDateTime.from('2023-11-30T14:30:00')
      expect(adapter.getMinutes(dt)).toBe(30)

      const updated = adapter.setMinutes(dt, 45)
      expect(adapter.getMinutes(updated)).toBe(45)
    })

    it('should add hours', () => {
      const dt = Temporal.PlainDateTime.from('2023-11-30T14:30:00')
      const result = adapter.addHours(dt, 5)
      expect(adapter.getHours(result)).toBe(19)
    })

    it('should add hours across day boundary', () => {
      const dt = Temporal.PlainDateTime.from('2023-11-30T22:00:00')
      const result = adapter.addHours(dt, 5)
      expect(adapter.getDate(result)).toBe(1) // Dec 1
      expect(adapter.getHours(result)).toBe(3)
    })

    it('should add minutes', () => {
      const dt = Temporal.PlainDateTime.from('2023-11-30T14:30:00')
      const result = adapter.addMinutes(dt, 45)
      expect(adapter.getHours(result)).toBe(15)
      expect(adapter.getMinutes(result)).toBe(15)
    })
  })

  describe('day boundaries with time', () => {
    const dt = Temporal.PlainDateTime.from('2023-11-15T14:30:45')

    it('should return start of day at midnight', () => {
      const result = adapter.startOfDay(dt)
      expect(adapter.getHours(result)).toBe(0)
      expect(adapter.getMinutes(result)).toBe(0)
    })

    it('should return end of day at 23:59:59.999', () => {
      const result = adapter.endOfDay(dt)
      expect(adapter.getHours(result)).toBe(23)
      expect(adapter.getMinutes(result)).toBe(59)
    })

    it('should return start of week at midnight', () => {
      const result = adapter.startOfWeek(dt, 0)
      expect(adapter.getHours(result)).toBe(0)
      expect(adapter.getMinutes(result)).toBe(0)
    })
  })

  describe('comparison with time', () => {
    it('should compare datetimes with time precision', () => {
      const dt1 = Temporal.PlainDateTime.from('2023-11-30T14:30:00')
      const dt2 = Temporal.PlainDateTime.from('2023-11-30T14:31:00')

      expect(adapter.isBefore(dt1, dt2)).toBe(true)
      expect(adapter.isAfter(dt2, dt1)).toBe(true)
      expect(adapter.isEqual(dt1, dt2)).toBe(false)
    })

    it('should check same day even with different times', () => {
      const morning = Temporal.PlainDateTime.from('2023-11-30T08:00:00')
      const evening = Temporal.PlainDateTime.from('2023-11-30T20:00:00')

      expect(adapter.isSameDay(morning, evening)).toBe(true)
    })

    it('should check after day ignoring time', () => {
      const dt1 = Temporal.PlainDateTime.from('2023-11-30T23:59:59')
      const dt2 = Temporal.PlainDateTime.from('2023-12-01T00:00:00')

      expect(adapter.isAfterDay(dt2, dt1)).toBe(true)
      expect(adapter.isAfterDay(dt1, dt2)).toBe(false)
    })
  })

  describe('time formatting', () => {
    const dt = Temporal.PlainDateTime.from('2023-11-30T14:30:00')

    it('should format with time formats', () => {
      const result = adapter.format(dt, 'fullTime24h')
      expect(result).toBeTruthy()
      expect(typeof result).toBe('string')
    })

    it('should format full datetime', () => {
      const result = adapter.format(dt, 'fullDateTime24h')
      expect(result).toBeTruthy()
      expect(typeof result).toBe('string')
    })
  })

  describe('diff with time', () => {
    it('should calculate diff in hours', () => {
      const dt1 = Temporal.PlainDateTime.from('2023-11-30T10:00:00')
      const dt2 = Temporal.PlainDateTime.from('2023-11-30T14:00:00')

      const diff = adapter.getDiff(dt2, dt1, 'hours')
      expect(diff).toBe(4)
    })

    it('should calculate diff in minutes', () => {
      const dt1 = Temporal.PlainDateTime.from('2023-11-30T10:00:00')
      const dt2 = Temporal.PlainDateTime.from('2023-11-30T10:30:00')

      const diff = adapter.getDiff(dt2, dt1, 'minutes')
      expect(diff).toBe(30)
    })
  })

  describe('ISO parsing with time', () => {
    it('should parse ISO datetime string', () => {
      const result = adapter.parseISO('2023-11-30T14:30:00')
      expect(result).toBeInstanceOf(Temporal.PlainDateTime)
      expect(adapter.getHours(result)).toBe(14)
      expect(adapter.getMinutes(result)).toBe(30)
    })

    it('should parse ISO date string and set midnight', () => {
      const result = adapter.parseISO('2023-11-30')
      expect(result).toBeInstanceOf(Temporal.PlainDateTime)
      expect(adapter.getHours(result)).toBe(0)
      expect(adapter.getMinutes(result)).toBe(0)
    })
  })
})
