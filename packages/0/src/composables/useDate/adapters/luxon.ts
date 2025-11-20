/**
 * Luxon adapter implementation example
 *
 * This adapter demonstrates how to implement the DateAdapter interface
 * using the Luxon library. To use this adapter, you must install luxon:
 *
 * ```bash
 * pnpm add luxon
 * pnpm add -D @types/luxon
 * ```
 *
 * @example
 * ```ts
 * import { createDate } from '@vuetify/v0'
 * import { LuxonAdapter } from '@vuetify/v0/composables/useDate/adapters/luxon'
 *
 * const [useDate, provideDate] = createDate({
 *   adapter: LuxonAdapter,
 *   locale: 'en-US'
 * })
 * ```
 */

import { DateTime, Info } from 'luxon'
import type { DateAdapter, DateAdapterOptions } from '../types'

/**
 * Date adapter using Luxon library
 *
 * @remarks
 * This adapter uses Luxon DateTime objects internally,
 * providing excellent timezone and internationalization support.
 * Luxon is particularly good for applications that need robust
 * timezone handling.
 */
export class LuxonAdapter implements DateAdapter<DateTime> {
  public locale: string
  private formats: Record<string, Intl.DateTimeFormatOptions>
  private firstDayOfWeek: number

  constructor(options: DateAdapterOptions = {}) {
    this.locale = options.locale ?? 'en-US'
    this.firstDayOfWeek = options.firstDayOfWeek ?? 0
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
      ...options.formats,
    }
  }

  // === Date Creation & Conversion ===

  date(value?: unknown): DateTime | null {
    if (value === undefined) {
      return DateTime.now().setLocale(this.locale)
    }

    if (value === null) {
      return null
    }

    if (value instanceof DateTime) {
      return value.setLocale(this.locale)
    }

    if (value instanceof Date) {
      return DateTime.fromJSDate(value).setLocale(this.locale)
    }

    if (typeof value === 'string') {
      // Try ISO format first
      let dt = DateTime.fromISO(value).setLocale(this.locale)
      if (dt.isValid) return dt

      // Try SQL format
      dt = DateTime.fromSQL(value).setLocale(this.locale)
      if (dt.isValid) return dt

      return null
    }

    if (typeof value === 'number') {
      return DateTime.fromMillis(value).setLocale(this.locale)
    }

    return null
  }

  toJsDate(date: DateTime): Date {
    return date.toJSDate()
  }

  toISO(date: DateTime): string {
    return date.toISO() ?? ''
  }

  parseISO(isoString: string): DateTime {
    return DateTime.fromISO(isoString).setLocale(this.locale)
  }

  // === Arithmetic Operations ===

  addMinutes(date: DateTime, amount: number): DateTime {
    return date.plus({ minutes: amount })
  }

  addHours(date: DateTime, amount: number): DateTime {
    return date.plus({ hours: amount })
  }

  addDays(date: DateTime, amount: number): DateTime {
    return date.plus({ days: amount })
  }

  addWeeks(date: DateTime, amount: number): DateTime {
    return date.plus({ weeks: amount })
  }

  addMonths(date: DateTime, amount: number): DateTime {
    return date.plus({ months: amount })
  }

  // === Date Boundaries ===

  startOfDay(date: DateTime): DateTime {
    return date.startOf('day')
  }

  endOfDay(date: DateTime): DateTime {
    return date.endOf('day')
  }

  startOfWeek(date: DateTime, firstDayOfWeek?: number): DateTime {
    const first = firstDayOfWeek ?? this.firstDayOfWeek
    // Luxon uses 1-7 for weekday (Monday = 1, Sunday = 7)
    // We need to convert from 0-6 (Sunday = 0) to Luxon's system
    const luxonFirst = first === 0 ? 7 : first
    const currentWeekday = date.weekday
    const diff = (currentWeekday - luxonFirst + 7) % 7
    return date.minus({ days: diff }).startOf('day')
  }

  endOfWeek(date: DateTime, firstDayOfWeek?: number): DateTime {
    const first = firstDayOfWeek ?? this.firstDayOfWeek
    const luxonFirst = first === 0 ? 7 : first
    const currentWeekday = date.weekday
    const diff = (luxonFirst + 6 - currentWeekday + 7) % 7
    return date.plus({ days: diff }).endOf('day')
  }

  startOfMonth(date: DateTime): DateTime {
    return date.startOf('month')
  }

  endOfMonth(date: DateTime): DateTime {
    return date.endOf('month')
  }

  startOfYear(date: DateTime): DateTime {
    return date.startOf('year')
  }

  endOfYear(date: DateTime): DateTime {
    return date.endOf('year')
  }

  // === Comparison ===

  isEqual(date: DateTime, comparing: DateTime): boolean {
    return date.equals(comparing)
  }

  isAfter(date: DateTime, comparing: DateTime): boolean {
    return date > comparing
  }

  isBefore(date: DateTime, comparing: DateTime): boolean {
    return date < comparing
  }

  isAfterDay(date: DateTime, comparing: DateTime): boolean {
    return this.startOfDay(date) > this.startOfDay(comparing)
  }

  isSameDay(date: DateTime, comparing: DateTime): boolean {
    return date.hasSame(comparing, 'day')
  }

  isSameMonth(date: DateTime, comparing: DateTime): boolean {
    return date.hasSame(comparing, 'month') && date.hasSame(comparing, 'year')
  }

  isSameYear(date: DateTime, comparing: DateTime): boolean {
    return date.hasSame(comparing, 'year')
  }

  isValid(date: unknown): boolean {
    const parsed = this.date(date)
    return parsed !== null && parsed.isValid
  }

  isWithinRange(date: DateTime, range: [DateTime, DateTime]): boolean {
    return (this.isEqual(date, range[0]) || this.isAfter(date, range[0])) &&
           (this.isEqual(date, range[1]) || this.isBefore(date, range[1]))
  }

  // === Getters ===

  getYear(date: DateTime): number {
    return date.year
  }

  getMonth(date: DateTime): number {
    return date.month - 1 // Convert to 0-indexed
  }

  getDate(date: DateTime): number {
    return date.day
  }

  getHours(date: DateTime): number {
    return date.hour
  }

  getMinutes(date: DateTime): number {
    return date.minute
  }

  getWeek(date: DateTime, firstDayOfWeek?: number): number {
    // Luxon's weekNumber uses ISO week numbering
    // For custom first day of week, we'd need to calculate manually
    return date.weekNumber
  }

  getWeekdays(
    firstDayOfWeek?: number,
    weekdayFormat: 'long' | 'short' | 'narrow' = 'long'
  ): string[] {
    const first = firstDayOfWeek ?? this.firstDayOfWeek
    const weekdays = Info.weekdays(weekdayFormat, { locale: this.locale })

    // Luxon returns weekdays starting from Monday
    // We need to reorder based on firstDayOfWeek
    // Convert first from 0-6 (Sunday = 0) to Luxon index (Monday = 0)
    const luxonFirst = first === 0 ? 6 : first - 1

    const reordered = [
      ...weekdays.slice(luxonFirst),
      ...weekdays.slice(0, luxonFirst),
    ]

    return reordered
  }

  getNextMonth(date: DateTime): DateTime {
    return date.plus({ months: 1 })
  }

  getPreviousMonth(date: DateTime): DateTime {
    return date.minus({ months: 1 })
  }

  // === Setters ===

  setYear(date: DateTime, year: number): DateTime {
    return date.set({ year })
  }

  setMonth(date: DateTime, month: number): DateTime {
    return date.set({ month: month + 1 }) // Convert from 0-indexed
  }

  setDate(date: DateTime, day: number): DateTime {
    return date.set({ day })
  }

  setHours(date: DateTime, hours: number): DateTime {
    return date.set({ hour: hours })
  }

  setMinutes(date: DateTime, minutes: number): DateTime {
    return date.set({ minute: minutes })
  }

  // === Utilities ===

  format(date: DateTime, formatString: string): string {
    const formatOptions = this.formats[formatString]

    if (formatOptions) {
      return date.toLocaleString(formatOptions)
    }

    // Try as a Luxon format string
    try {
      return date.toFormat(formatString)
    } catch {
      return this.toISO(date)
    }
  }

  getDiff(
    date: DateTime,
    comparing: DateTime | string,
    unit: 'days' | 'months' | 'years' | 'hours' | 'minutes' = 'days'
  ): number {
    const compareDate = typeof comparing === 'string' ? this.parseISO(comparing) : comparing
    const diff = date.diff(compareDate, unit)

    switch (unit) {
      case 'years':
        return diff.years
      case 'months':
        return diff.months
      case 'days':
        return diff.days
      case 'hours':
        return diff.hours
      case 'minutes':
        return diff.minutes
      default:
        return diff.days
    }
  }

  getWeekArray(date: DateTime, firstDayOfWeek?: number): DateTime[][] {
    const first = firstDayOfWeek ?? this.firstDayOfWeek
    const start = this.startOfWeek(this.startOfMonth(date), first)
    const end = this.endOfWeek(this.endOfMonth(date), first)

    const weeks: DateTime[][] = []
    let currentWeek: DateTime[] = []
    let current = start

    while (this.isBefore(current, end) || this.isEqual(current, end)) {
      currentWeek.push(this.startOfDay(current))

      if (currentWeek.length === 7) {
        weeks.push(currentWeek)
        currentWeek = []
      }

      current = current.plus({ days: 1 })
    }

    if (currentWeek.length > 0) {
      weeks.push(currentWeek)
    }

    return weeks
  }
}
