import { describe, it, expect } from 'vitest'
import { V0DateAdapter } from '../adapters/v0'
import { createVuetify3DateBridge } from './vuetify3'

describe('createVuetify3DateBridge', () => {
  const v0Adapter = new V0DateAdapter('en-US')

  describe('internal mode', () => {
    const bridge = createVuetify3DateBridge(v0Adapter, { outputMode: 'internal' })

    it('should return locale', () => {
      expect(bridge.locale).toBe('en-US')
    })

    it('should create date from various inputs', () => {
      const now = bridge.date()
      expect(now).not.toBeNull()

      const fromString = bridge.date('2024-06-15T10:30:00')
      expect(fromString).not.toBeNull()
      expect(bridge.toISO(fromString!)).toBe('2024-06-15T10:30:00')
    })

    it('should format dates', () => {
      const date = bridge.date('2024-06-15T10:30:00')
      const formatted = bridge.format(date, 'monthAndYear')
      expect(formatted).toContain('June')
      expect(formatted).toContain('2024')
    })

    it('should handle date arithmetic', () => {
      const date = bridge.date('2024-06-15T10:30:00')
      const nextDay = bridge.addDays(date, 1)
      expect(bridge.getDate(nextDay)).toBe(16)

      const nextMonth = bridge.addMonths(date, 1)
      expect(bridge.getMonth(nextMonth)).toBe(6) // July (0-indexed)
    })

    it('should compare dates', () => {
      const date1 = bridge.date('2024-06-15T10:30:00')
      const date2 = bridge.date('2024-06-16T10:30:00')

      expect(bridge.isBefore(date1, date2)).toBe(true)
      expect(bridge.isAfter(date2, date1)).toBe(true)
      expect(bridge.isSameDay(date1, date1)).toBe(true)
      expect(bridge.isSameMonth(date1, date2)).toBe(true)
    })

    it('should get boundaries', () => {
      const date = bridge.date('2024-06-15T10:30:00')

      const startOfDay = bridge.startOfDay(date)
      expect(bridge.getHours(startOfDay)).toBe(0)
      expect(bridge.getMinutes(startOfDay)).toBe(0)

      const endOfDay = bridge.endOfDay(date)
      expect(bridge.getHours(endOfDay)).toBe(23)
      expect(bridge.getMinutes(endOfDay)).toBe(59)

      const startOfMonth = bridge.startOfMonth(date)
      expect(bridge.getDate(startOfMonth)).toBe(1)
    })

    it('should get week data', () => {
      const date = bridge.date('2024-06-15T10:30:00')

      const weekArray = bridge.getWeekArray(date)
      expect(weekArray.length).toBeGreaterThan(0)
      expect(weekArray[0]!.length).toBe(7)

      const weekdays = bridge.getWeekdays()
      expect(weekdays).toHaveLength(7)
    })

    it('should set date components', () => {
      const date = bridge.date('2024-06-15T10:30:00')

      const newYear = bridge.setYear(date, 2025)
      expect(bridge.getYear(newYear)).toBe(2025)

      const newMonth = bridge.setMonth(date, 11) // December
      expect(bridge.getMonth(newMonth)).toBe(11)

      const newDay = bridge.setDate(date, 25)
      expect(bridge.getDate(newDay)).toBe(25)
    })

    it('should navigate months', () => {
      const date = bridge.date('2024-06-15T10:30:00')

      const nextMonth = bridge.getNextMonth(date)
      expect(bridge.getMonth(nextMonth)).toBe(6) // July

      const prevMonth = bridge.getPreviousMonth(date)
      expect(bridge.getMonth(prevMonth)).toBe(4) // May
    })
  })

  describe('ISO mode', () => {
    const bridge = createVuetify3DateBridge(v0Adapter, { outputMode: 'iso' })

    it('should return ISO strings', () => {
      const date = bridge.date('2024-06-15T10:30:00')
      expect(typeof date).toBe('string')
      expect(date).toBe('2024-06-15T10:30:00')
    })

    it('should accept ISO strings as input', () => {
      const date = bridge.addDays('2024-06-15T10:30:00', 1)
      expect(date).toBe('2024-06-16T10:30:00')
    })

    it('should return ISO strings in week array', () => {
      const weekArray = bridge.getWeekArray('2024-06-15T10:30:00')
      expect(typeof weekArray[0]![0]).toBe('string')
    })
  })

  describe('firstDayOfWeek option', () => {
    it('should use Sunday as default', () => {
      const bridge = createVuetify3DateBridge(v0Adapter)
      const weekdays = bridge.getWeekdays()
      expect(weekdays[0]).toBe('Sun')
    })

    it('should use Monday when configured', () => {
      const bridge = createVuetify3DateBridge(v0Adapter, { firstDayOfWeek: 1 })
      const weekdays = bridge.getWeekdays()
      expect(weekdays[0]).toBe('Mon')
    })
  })

  describe('edge cases', () => {
    const bridge = createVuetify3DateBridge(v0Adapter)

    it('should handle null/undefined input', () => {
      const date1 = bridge.date(null)
      expect(date1).not.toBeNull() // Returns current date

      const date2 = bridge.date(undefined)
      expect(date2).not.toBeNull() // Returns current date
    })

    it('should validate dates', () => {
      expect(bridge.isValid('2024-06-15')).toBe(true)
      expect(bridge.isValid('invalid-date')).toBe(false)
    })

    it('should convert to JS Date', () => {
      const date = bridge.date('2024-06-15T10:30:00')
      const jsDate = bridge.toJsDate(date)
      expect(jsDate).toBeInstanceOf(Date)
      expect(jsDate.getFullYear()).toBe(2024)
      expect(jsDate.getMonth()).toBe(5) // June (0-indexed)
    })

    it('should calculate diff', () => {
      const date1 = bridge.date('2024-06-15T10:30:00')
      const date2 = bridge.date('2024-06-20T10:30:00')
      expect(bridge.getDiff(date2, date1, 'days')).toBe(5)
    })

    it('should check range', () => {
      const date = bridge.date('2024-06-15T10:30:00')
      const start = bridge.date('2024-06-01T00:00:00')
      const end = bridge.date('2024-06-30T23:59:59')
      expect(bridge.isWithinRange(date, [start, end])).toBe(true)
    })
  })
})
