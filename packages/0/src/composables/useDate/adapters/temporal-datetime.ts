/**
 * Temporal-based datetime adapter implementation
 *
 * Uses Temporal.PlainDateTime for operations requiring time support.
 * Unlike the base TemporalAdapter which uses PlainDate, this adapter
 * supports hours, minutes, and full datetime operations.
 */

import { Temporal } from '@js-temporal/polyfill'
import type { DateAdapter, DateAdapterOptions } from '../types'

/**
 * DateTime adapter using Temporal API with time support
 *
 * @remarks
 * This adapter uses Temporal.PlainDateTime for all operations,
 * providing full date and time support including hours and minutes.
 * All operations are immutable and create new datetime instances.
 */
export class TemporalDateTimeAdapter implements DateAdapter<Temporal.PlainDateTime> {
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
      hours12h: { hour: 'numeric', hour12: true },
      hours24h: { hour: 'numeric', hour12: false },
      minutes: { minute: 'numeric' },
      fullTime12h: { hour: 'numeric', minute: 'numeric', hour12: true },
      fullTime24h: { hour: 'numeric', minute: 'numeric', hour12: false },
      fullDateTime12h: { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true },
      fullDateTime24h: { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false },
      keyboardDate: { year: 'numeric', month: '2-digit', day: '2-digit' },
      keyboardDateTime12h: { year: 'numeric', month: '2-digit', day: '2-digit', hour: 'numeric', minute: 'numeric', hour12: true },
      keyboardDateTime24h: { year: 'numeric', month: '2-digit', day: '2-digit', hour: 'numeric', minute: 'numeric', hour12: false },
      ...options.formats,
    }
  }

  // === Date Creation & Conversion ===

  date(value?: unknown): Temporal.PlainDateTime | null {
    if (value === undefined) {
      return Temporal.Now.plainDateTimeISO()
    }

    if (value === null) {
      return null
    }

    if (value instanceof Temporal.PlainDateTime) {
      return value
    }

    if (value instanceof Temporal.PlainDate) {
      return value.toPlainDateTime()
    }

    if (value instanceof Temporal.ZonedDateTime) {
      return value.toPlainDateTime()
    }

    if (value instanceof Date) {
      return Temporal.PlainDateTime.from({
        year: value.getFullYear(),
        month: value.getMonth() + 1,
        day: value.getDate(),
        hour: value.getHours(),
        minute: value.getMinutes(),
        second: value.getSeconds(),
        millisecond: value.getMilliseconds(),
      })
    }

    if (typeof value === 'string') {
      try {
        return this.parseISO(value)
      } catch {
        return null
      }
    }

    if (typeof value === 'number') {
      const jsDate = new Date(value)
      return Temporal.PlainDateTime.from({
        year: jsDate.getFullYear(),
        month: jsDate.getMonth() + 1,
        day: jsDate.getDate(),
        hour: jsDate.getHours(),
        minute: jsDate.getMinutes(),
        second: jsDate.getSeconds(),
        millisecond: jsDate.getMilliseconds(),
      })
    }

    return null
  }

  toJsDate(date: Temporal.PlainDateTime): Date {
    return new Date(
      date.year,
      date.month - 1,
      date.day,
      date.hour,
      date.minute,
      date.second,
      date.millisecond
    )
  }

  toISO(date: Temporal.PlainDateTime): string {
    return date.toString()
  }

  parseISO(isoString: string): Temporal.PlainDateTime {
    // Handle various ISO formats
    if (isoString.includes('Z') || isoString.includes('+') || isoString.includes('-', 10)) {
      // ZonedDateTime or Instant format
      try {
        return Temporal.Instant.from(isoString).toZonedDateTimeISO('UTC').toPlainDateTime()
      } catch {
        // Fall through to try PlainDateTime
      }
    }

    if (isoString.includes('T')) {
      // PlainDateTime format
      return Temporal.PlainDateTime.from(isoString)
    }

    // Plain date format - add midnight time
    return Temporal.PlainDate.from(isoString).toPlainDateTime()
  }

  // === Arithmetic Operations ===

  addMinutes(date: Temporal.PlainDateTime, amount: number): Temporal.PlainDateTime {
    return date.add({ minutes: amount })
  }

  addHours(date: Temporal.PlainDateTime, amount: number): Temporal.PlainDateTime {
    return date.add({ hours: amount })
  }

  addDays(date: Temporal.PlainDateTime, amount: number): Temporal.PlainDateTime {
    return date.add({ days: amount })
  }

  addWeeks(date: Temporal.PlainDateTime, amount: number): Temporal.PlainDateTime {
    return date.add({ weeks: amount })
  }

  addMonths(date: Temporal.PlainDateTime, amount: number): Temporal.PlainDateTime {
    return date.add({ months: amount })
  }

  // === Date Boundaries ===

  startOfDay(date: Temporal.PlainDateTime): Temporal.PlainDateTime {
    return date.with({ hour: 0, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 })
  }

  endOfDay(date: Temporal.PlainDateTime): Temporal.PlainDateTime {
    return date.with({ hour: 23, minute: 59, second: 59, millisecond: 999, microsecond: 999, nanosecond: 999 })
  }

  startOfWeek(date: Temporal.PlainDateTime, firstDayOfWeek?: number): Temporal.PlainDateTime {
    const first = firstDayOfWeek ?? this.firstDayOfWeek
    const dayOfWeek = date.dayOfWeek % 7 // Convert to 0-6 (Temporal uses 1-7)
    const diff = (dayOfWeek - first + 7) % 7
    return this.startOfDay(date.subtract({ days: diff }))
  }

  endOfWeek(date: Temporal.PlainDateTime, firstDayOfWeek?: number): Temporal.PlainDateTime {
    const first = firstDayOfWeek ?? this.firstDayOfWeek
    const dayOfWeek = date.dayOfWeek % 7
    const diff = (first + 6 - dayOfWeek + 7) % 7
    return this.endOfDay(date.add({ days: diff }))
  }

  startOfMonth(date: Temporal.PlainDateTime): Temporal.PlainDateTime {
    return this.startOfDay(date.with({ day: 1 }))
  }

  endOfMonth(date: Temporal.PlainDateTime): Temporal.PlainDateTime {
    return this.endOfDay(date.with({ day: date.daysInMonth }))
  }

  startOfYear(date: Temporal.PlainDateTime): Temporal.PlainDateTime {
    return this.startOfDay(date.with({ month: 1, day: 1 }))
  }

  endOfYear(date: Temporal.PlainDateTime): Temporal.PlainDateTime {
    return this.endOfDay(date.with({ month: 12, day: 31 }))
  }

  // === Comparison ===

  isEqual(date: Temporal.PlainDateTime, comparing: Temporal.PlainDateTime): boolean {
    return Temporal.PlainDateTime.compare(date, comparing) === 0
  }

  isAfter(date: Temporal.PlainDateTime, comparing: Temporal.PlainDateTime): boolean {
    return Temporal.PlainDateTime.compare(date, comparing) > 0
  }

  isBefore(date: Temporal.PlainDateTime, comparing: Temporal.PlainDateTime): boolean {
    return Temporal.PlainDateTime.compare(date, comparing) < 0
  }

  isAfterDay(date: Temporal.PlainDateTime, comparing: Temporal.PlainDateTime): boolean {
    const date1 = this.startOfDay(date)
    const date2 = this.startOfDay(comparing)
    return Temporal.PlainDateTime.compare(date1, date2) > 0
  }

  isSameDay(date: Temporal.PlainDateTime, comparing: Temporal.PlainDateTime): boolean {
    return date.year === comparing.year &&
           date.month === comparing.month &&
           date.day === comparing.day
  }

  isSameMonth(date: Temporal.PlainDateTime, comparing: Temporal.PlainDateTime): boolean {
    return date.year === comparing.year && date.month === comparing.month
  }

  isSameYear(date: Temporal.PlainDateTime, comparing: Temporal.PlainDateTime): boolean {
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

  isWithinRange(date: Temporal.PlainDateTime, range: [Temporal.PlainDateTime, Temporal.PlainDateTime]): boolean {
    return (this.isEqual(date, range[0]) || this.isAfter(date, range[0])) &&
           (this.isEqual(date, range[1]) || this.isBefore(date, range[1]))
  }

  // === Getters ===

  getYear(date: Temporal.PlainDateTime): number {
    return date.year
  }

  getMonth(date: Temporal.PlainDateTime): number {
    return date.month - 1 // Convert to 0-indexed (JavaScript Date convention)
  }

  getDate(date: Temporal.PlainDateTime): number {
    return date.day
  }

  getHours(date: Temporal.PlainDateTime): number {
    return date.hour
  }

  getMinutes(date: Temporal.PlainDateTime): number {
    return date.minute
  }

  getWeek(
    date: Temporal.PlainDateTime,
    firstDayOfWeek?: number,
    firstDayOfYear?: number
  ): number {
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

    const plainDate1 = date.toPlainDate()
    const plainDate2 = startOfFirstWeek.toPlainDate()
    const daysDiff = plainDate1.since(plainDate2).total({ unit: 'days' })
    return Math.floor(daysDiff / 7) + 1
  }

  getWeekdays(
    firstDayOfWeek?: number,
    weekdayFormat: 'long' | 'short' | 'narrow' = 'long'
  ): string[] {
    const first = firstDayOfWeek ?? this.firstDayOfWeek
    const weekdays: string[] = []
    const baseDate = Temporal.PlainDateTime.from('2023-01-01T00:00:00') // A Sunday

    // Find the first occurrence of the desired first day
    const startDate = this.startOfWeek(baseDate, first)

    for (let i = 0; i < 7; i++) {
      const date = startDate.add({ days: i })
      const formatter = new Intl.DateTimeFormat(this.locale, { weekday: weekdayFormat })
      weekdays.push(formatter.format(this.toJsDate(date)))
    }

    return weekdays
  }

  getNextMonth(date: Temporal.PlainDateTime): Temporal.PlainDateTime {
    return date.add({ months: 1 })
  }

  getPreviousMonth(date: Temporal.PlainDateTime): Temporal.PlainDateTime {
    return date.subtract({ months: 1 })
  }

  // === Setters ===

  setYear(date: Temporal.PlainDateTime, year: number): Temporal.PlainDateTime {
    return date.with({ year })
  }

  setMonth(date: Temporal.PlainDateTime, month: number): Temporal.PlainDateTime {
    // Convert from 0-indexed to 1-indexed
    return date.with({ month: month + 1 })
  }

  setDate(date: Temporal.PlainDateTime, day: number): Temporal.PlainDateTime {
    return date.with({ day })
  }

  setHours(date: Temporal.PlainDateTime, hours: number): Temporal.PlainDateTime {
    return date.with({ hour: hours })
  }

  setMinutes(date: Temporal.PlainDateTime, minutes: number): Temporal.PlainDateTime {
    return date.with({ minute: minutes })
  }

  // === Utilities ===

  format(date: Temporal.PlainDateTime, formatString: string): string {
    const formatOptions = this.formats[formatString]

    if (formatOptions) {
      const formatter = new Intl.DateTimeFormat(this.locale, formatOptions)
      return formatter.format(this.toJsDate(date))
    }

    // If not a predefined format, return ISO format as fallback
    return this.toISO(date)
  }

  getDiff(
    date: Temporal.PlainDateTime,
    comparing: Temporal.PlainDateTime | string,
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
        const duration = date.since(compareDate, { largestUnit: 'days' })
        return duration.days + (duration.hours / 24)
      }
      case 'hours': {
        const duration = date.since(compareDate, { largestUnit: 'hours' })
        return duration.hours + (duration.minutes / 60)
      }
      case 'minutes': {
        const duration = date.since(compareDate, { largestUnit: 'minutes' })
        return duration.minutes + (duration.seconds / 60)
      }
      default: {
        const duration = date.since(compareDate, { largestUnit: 'days' })
        return duration.days + (duration.hours / 24)
      }
    }
  }

  getWeekArray(date: Temporal.PlainDateTime, firstDayOfWeek?: number): Temporal.PlainDateTime[][] {
    const first = firstDayOfWeek ?? this.firstDayOfWeek
    const start = this.startOfWeek(this.startOfMonth(date), first)
    const end = this.endOfWeek(this.endOfMonth(date), first)

    const weeks: Temporal.PlainDateTime[][] = []
    let currentWeek: Temporal.PlainDateTime[] = []
    let current = start

    while (this.isBefore(current, end) || this.isSameDay(current, end)) {
      currentWeek.push(this.startOfDay(current))

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
