/**
 * Temporal-based date adapter implementation
 *
 * Uses the Temporal API (TC39 proposal) for modern date/time operations.
 * Provides a polyfill-compatible implementation using PlainDate and ZonedDateTime.
 */

import { Temporal } from '@js-temporal/polyfill'
import type { DateAdapter, DateAdapterOptions } from '../types'

/**
 * Date adapter using Temporal API
 *
 * @remarks
 * This adapter uses Temporal.PlainDate for date-only operations and
 * Temporal.ZonedDateTime for operations requiring time/timezone support.
 * All operations are immutable and create new date instances.
 */
export class TemporalAdapter implements DateAdapter<Temporal.PlainDate> {
  public locale: string
  private formats: Record<string, Intl.DateTimeFormatOptions>
  private firstDayOfWeek: number
  private firstDayOfYear: number

  constructor(options: DateAdapterOptions = {}) {
    this.locale = options.locale ?? 'en-US'
    this.firstDayOfWeek = options.firstDayOfWeek ?? 0
    this.firstDayOfYear = options.firstDayOfYear ?? 1
    this.formats = {
      fullDate: { year: 'numeric', month: 'long', day: 'numeric' },
      fullDateWithWeekday: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
      normalDate: { year: 'numeric', month: 'short', day: 'numeric' },
      normalDateWithWeekday: { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' },
      shortDate: { month: 'short', day: 'numeric' },
      year: { year: 'numeric' },
      month: { month: 'long' },
      monthShort: { month: 'short' },
      monthAndYear: { month: 'long', year: 'numeric' },
      monthAndDate: { month: 'long', day: 'numeric' },
      weekday: { weekday: 'long' },
      weekdayShort: { weekday: 'short' },
      dayOfMonth: { day: 'numeric' },
      ...options.formats,
    }
  }

  // === Date Creation & Conversion ===

  date(value?: unknown): Temporal.PlainDate | null {
    if (value === undefined) {
      return Temporal.Now.plainDateISO()
    }

    if (value === null) {
      return null
    }

    if (value instanceof Temporal.PlainDate) {
      return value
    }

    if (value instanceof Temporal.ZonedDateTime) {
      return value.toPlainDate()
    }

    if (value instanceof Temporal.PlainDateTime) {
      return value.toPlainDate()
    }

    if (value instanceof Date) {
      const instant = Temporal.Instant.fromEpochMilliseconds(value.getTime())
      return instant.toZonedDateTimeISO('UTC').toPlainDate()
    }

    if (typeof value === 'string') {
      try {
        return this.parseISO(value)
      } catch {
        return null
      }
    }

    if (typeof value === 'number') {
      const instant = Temporal.Instant.fromEpochMilliseconds(value)
      return instant.toZonedDateTimeISO('UTC').toPlainDate()
    }

    return null
  }

  toJsDate(date: Temporal.PlainDate): Date {
    const zdt = date.toZonedDateTime({ timeZone: 'UTC', plainTime: Temporal.PlainTime.from('00:00:00') })
    return new Date(zdt.epochMilliseconds)
  }

  toISO(date: Temporal.PlainDate): string {
    return date.toString()
  }

  parseISO(isoString: string): Temporal.PlainDate {
    // Handle various ISO formats
    if (isoString.includes('T') || isoString.includes('Z')) {
      // DateTime or ZonedDateTime format
      return Temporal.Instant.from(isoString).toZonedDateTimeISO('UTC').toPlainDate()
    }
    // Plain date format
    return Temporal.PlainDate.from(isoString)
  }

  // === Arithmetic Operations ===

  addMinutes(date: Temporal.PlainDate, amount: number): Temporal.PlainDate {
    // PlainDate doesn't support time, convert to DateTime
    const dt = date.toPlainDateTime(Temporal.PlainTime.from('00:00:00'))
    return dt.add({ minutes: amount }).toPlainDate()
  }

  addHours(date: Temporal.PlainDate, amount: number): Temporal.PlainDate {
    const dt = date.toPlainDateTime(Temporal.PlainTime.from('00:00:00'))
    return dt.add({ hours: amount }).toPlainDate()
  }

  addDays(date: Temporal.PlainDate, amount: number): Temporal.PlainDate {
    return date.add({ days: amount })
  }

  addWeeks(date: Temporal.PlainDate, amount: number): Temporal.PlainDate {
    return date.add({ weeks: amount })
  }

  addMonths(date: Temporal.PlainDate, amount: number): Temporal.PlainDate {
    return date.add({ months: amount })
  }

  // === Date Boundaries ===

  startOfDay(date: Temporal.PlainDate): Temporal.PlainDate {
    // PlainDate is already at start of day
    return date
  }

  endOfDay(date: Temporal.PlainDate): Temporal.PlainDate {
    // PlainDate is already at end of day (represents the whole day)
    return date
  }

  startOfWeek(date: Temporal.PlainDate, firstDayOfWeek?: number): Temporal.PlainDate {
    const first = firstDayOfWeek ?? this.firstDayOfWeek
    const dayOfWeek = date.dayOfWeek % 7 // Convert to 0-6 (Temporal uses 1-7)
    const diff = (dayOfWeek - first + 7) % 7
    return date.subtract({ days: diff })
  }

  endOfWeek(date: Temporal.PlainDate, firstDayOfWeek?: number): Temporal.PlainDate {
    const first = firstDayOfWeek ?? this.firstDayOfWeek
    const dayOfWeek = date.dayOfWeek % 7
    const diff = (first + 6 - dayOfWeek + 7) % 7
    return date.add({ days: diff })
  }

  startOfMonth(date: Temporal.PlainDate): Temporal.PlainDate {
    return date.with({ day: 1 })
  }

  endOfMonth(date: Temporal.PlainDate): Temporal.PlainDate {
    return date.with({ day: date.daysInMonth })
  }

  startOfYear(date: Temporal.PlainDate): Temporal.PlainDate {
    return date.with({ month: 1, day: 1 })
  }

  endOfYear(date: Temporal.PlainDate): Temporal.PlainDate {
    return date.with({ month: 12, day: 31 })
  }

  // === Comparison ===

  isEqual(date: Temporal.PlainDate, comparing: Temporal.PlainDate): boolean {
    return Temporal.PlainDate.compare(date, comparing) === 0
  }

  isAfter(date: Temporal.PlainDate, comparing: Temporal.PlainDate): boolean {
    return Temporal.PlainDate.compare(date, comparing) > 0
  }

  isBefore(date: Temporal.PlainDate, comparing: Temporal.PlainDate): boolean {
    return Temporal.PlainDate.compare(date, comparing) < 0
  }

  isAfterDay(date: Temporal.PlainDate, comparing: Temporal.PlainDate): boolean {
    return this.isAfter(date, comparing)
  }

  isSameDay(date: Temporal.PlainDate, comparing: Temporal.PlainDate): boolean {
    return this.isEqual(date, comparing)
  }

  isSameMonth(date: Temporal.PlainDate, comparing: Temporal.PlainDate): boolean {
    return date.year === comparing.year && date.month === comparing.month
  }

  isSameYear(date: Temporal.PlainDate, comparing: Temporal.PlainDate): boolean {
    return date.year === comparing.year
  }

  isValid(date: unknown): boolean {
    try {
      const parsed = this.date(date)
      return parsed !== null
    } catch {
      return false
    }
  }

  isWithinRange(date: Temporal.PlainDate, range: [Temporal.PlainDate, Temporal.PlainDate]): boolean {
    return (this.isEqual(date, range[0]) || this.isAfter(date, range[0])) &&
           (this.isEqual(date, range[1]) || this.isBefore(date, range[1]))
  }

  // === Getters ===

  getYear(date: Temporal.PlainDate): number {
    return date.year
  }

  getMonth(date: Temporal.PlainDate): number {
    return date.month - 1 // Convert to 0-indexed (JavaScript Date convention)
  }

  getDate(date: Temporal.PlainDate): number {
    return date.day
  }

  getHours(date: Temporal.PlainDate): number {
    // PlainDate doesn't have hours, return 0
    return 0
  }

  getMinutes(date: Temporal.PlainDate): number {
    // PlainDate doesn't have minutes, return 0
    return 0
  }

  getWeek(
    date: Temporal.PlainDate,
    firstDayOfWeek?: number,
    firstDayOfYear?: number
  ): number {
    // ISO week number calculation
    const firstDay = firstDayOfWeek ?? this.firstDayOfWeek
    const firstDayYear = firstDayOfYear ?? this.firstDayOfYear

    const startOfYear = this.startOfYear(date)
    const startOfFirstWeek = this.startOfWeek(
      startOfYear.add({ days: firstDayYear - 1 }),
      firstDay
    )

    if (this.isBefore(date, startOfFirstWeek)) {
      return this.getWeek(date.subtract({ years: 1 }), firstDay, firstDayYear)
    }

    const daysDiff = date.since(startOfFirstWeek).days
    return Math.floor(daysDiff / 7) + 1
  }

  getWeekdays(
    firstDayOfWeek?: number,
    weekdayFormat: 'long' | 'short' | 'narrow' = 'long'
  ): string[] {
    const first = firstDayOfWeek ?? this.firstDayOfWeek
    const weekdays: string[] = []
    const baseDate = Temporal.PlainDate.from('2023-01-01') // A Sunday

    // Find the first occurrence of the desired first day
    const startDate = this.startOfWeek(baseDate, first)

    for (let i = 0; i < 7; i++) {
      const date = startDate.add({ days: i })
      const formatter = new Intl.DateTimeFormat(this.locale, { weekday: weekdayFormat })
      weekdays.push(formatter.format(this.toJsDate(date)))
    }

    return weekdays
  }

  getNextMonth(date: Temporal.PlainDate): Temporal.PlainDate {
    return date.add({ months: 1 })
  }

  getPreviousMonth(date: Temporal.PlainDate): Temporal.PlainDate {
    return date.subtract({ months: 1 })
  }

  // === Setters ===

  setYear(date: Temporal.PlainDate, year: number): Temporal.PlainDate {
    return date.with({ year })
  }

  setMonth(date: Temporal.PlainDate, month: number): Temporal.PlainDate {
    // Convert from 0-indexed to 1-indexed
    return date.with({ month: month + 1 })
  }

  setDate(date: Temporal.PlainDate, day: number): Temporal.PlainDate {
    return date.with({ day })
  }

  setHours(date: Temporal.PlainDate, hours: number): Temporal.PlainDate {
    // PlainDate doesn't support hours, return as-is
    return date
  }

  setMinutes(date: Temporal.PlainDate, minutes: number): Temporal.PlainDate {
    // PlainDate doesn't support minutes, return as-is
    return date
  }

  // === Utilities ===

  format(date: Temporal.PlainDate, formatString: string): string {
    const formatOptions = this.formats[formatString]

    if (formatOptions) {
      const formatter = new Intl.DateTimeFormat(this.locale, formatOptions)
      return formatter.format(this.toJsDate(date))
    }

    // If not a predefined format, treat as a custom format string
    // For now, return ISO format as fallback
    return this.toISO(date)
  }

  getDiff(
    date: Temporal.PlainDate,
    comparing: Temporal.PlainDate | string,
    unit: 'days' | 'months' | 'years' | 'hours' | 'minutes' = 'days'
  ): number {
    const compareDate = typeof comparing === 'string' ? this.parseISO(comparing) : comparing

    switch (unit) {
      case 'years': {
        const duration = date.since(compareDate, { largestUnit: 'years' })
        return duration.years + (duration.months / 12)
      }
      case 'months': {
        const duration = date.since(compareDate, { largestUnit: 'months' })
        return duration.months + (duration.years * 12)
      }
      case 'days': {
        const duration = date.since(compareDate)
        return duration.total({ unit: 'days' })
      }
      case 'hours': {
        const duration = date.since(compareDate)
        return duration.total({ unit: 'hours' })
      }
      case 'minutes': {
        const duration = date.since(compareDate)
        return duration.total({ unit: 'minutes' })
      }
      default: {
        const duration = date.since(compareDate)
        return duration.total({ unit: 'days' })
      }
    }
  }

  getWeekArray(date: Temporal.PlainDate, firstDayOfWeek?: number): Temporal.PlainDate[][] {
    const first = firstDayOfWeek ?? this.firstDayOfWeek
    const start = this.startOfWeek(this.startOfMonth(date), first)
    const end = this.endOfWeek(this.endOfMonth(date), first)

    const weeks: Temporal.PlainDate[][] = []
    let currentWeek: Temporal.PlainDate[] = []
    let current = start

    while (this.isBefore(current, end) || this.isEqual(current, end)) {
      currentWeek.push(current)

      if (currentWeek.length === 7) {
        weeks.push(currentWeek)
        currentWeek = []
      }

      current = current.add({ days: 1 })
    }

    if (currentWeek.length > 0) {
      weeks.push(currentWeek)
    }

    return weeks
  }
}
