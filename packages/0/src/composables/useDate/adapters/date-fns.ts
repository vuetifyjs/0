/**
 * date-fns adapter implementation example
 *
 * This adapter demonstrates how to implement the DateAdapter interface
 * using the date-fns library. To use this adapter, you must install date-fns:
 *
 * ```bash
 * pnpm add date-fns
 * ```
 *
 * @example
 * ```ts
 * import { createDate } from '@vuetify/v0'
 * import { DateFnsAdapter } from '@vuetify/v0/composables/useDate/adapters/date-fns'
 *
 * const [useDate, provideDate] = createDate({
 *   adapter: DateFnsAdapter,
 *   locale: 'en-US'
 * })
 * ```
 */

import {
  addDays,
  addHours,
  addMinutes,
  addMonths,
  addWeeks,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInMonths,
  differenceInYears,
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  getDate,
  getDay,
  getHours,
  getMinutes,
  getMonth,
  getWeek,
  getYear,
  isAfter,
  isBefore,
  isEqual,
  isSameDay,
  isSameMonth,
  isSameYear,
  isValid,
  isWithinInterval,
  parseISO,
  setDate,
  setHours,
  setMinutes,
  setMonth,
  setYear,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from 'date-fns'
import { enUS, type Locale } from 'date-fns/locale'
import type { DateAdapter, DateAdapterOptions } from '../types'

// Map of locale codes to date-fns locales
// You can extend this map with additional locales as needed
const localeMap: Record<string, Locale> = {
  'en-US': enUS,
  // Add more locales as needed:
  // 'fr-FR': fr,
  // 'de-DE': de,
  // 'es-ES': es,
}

/**
 * Date adapter using date-fns library
 *
 * @remarks
 * This adapter uses native JavaScript Date objects internally,
 * providing a familiar API for date manipulation with the power
 * of the date-fns library.
 */
export class DateFnsAdapter implements DateAdapter<Date> {
  public locale: string
  private dateFnsLocale: Locale
  private formats: Record<string, string>
  private firstDayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6

  constructor(options: DateAdapterOptions = {}) {
    this.locale = options.locale ?? 'en-US'
    this.dateFnsLocale = localeMap[this.locale] ?? enUS
    this.firstDayOfWeek = (options.firstDayOfWeek ?? 0) as 0 | 1 | 2 | 3 | 4 | 5 | 6
    this.formats = {
      fullDate: 'MMMM d, yyyy',
      fullDateWithWeekday: 'EEEE, MMMM d, yyyy',
      normalDate: 'MMM d, yyyy',
      normalDateWithWeekday: 'EEE, MMM d, yyyy',
      shortDate: 'MMM d',
      year: 'yyyy',
      month: 'MMMM',
      monthShort: 'MMM',
      monthAndYear: 'MMMM yyyy',
      monthAndDate: 'MMMM d',
      weekday: 'EEEE',
      weekdayShort: 'EEE',
      dayOfMonth: 'd',
      hours12h: 'h a',
      hours24h: 'HH',
      minutes: 'mm',
      fullTime12h: 'h:mm a',
      fullTime24h: 'HH:mm',
      fullDateTime12h: 'MMM d, yyyy h:mm a',
      fullDateTime24h: 'MMM d, yyyy HH:mm',
      keyboardDate: 'MM/dd/yyyy',
      keyboardDateTime12h: 'MM/dd/yyyy h:mm a',
      keyboardDateTime24h: 'MM/dd/yyyy HH:mm',
      ...(options.formats as Record<string, string> | undefined),
    }
  }

  // === Date Creation & Conversion ===

  date(value?: unknown): Date | null {
    if (value === undefined) {
      return new Date()
    }

    if (value === null) {
      return null
    }

    if (value instanceof Date) {
      return value
    }

    if (typeof value === 'string') {
      const parsed = parseISO(value)
      return isValid(parsed) ? parsed : null
    }

    if (typeof value === 'number') {
      return new Date(value)
    }

    return null
  }

  toJsDate(date: Date): Date {
    return date
  }

  toISO(date: Date): string {
    return date.toISOString()
  }

  parseISO(isoString: string): Date {
    return parseISO(isoString)
  }

  // === Arithmetic Operations ===

  addMinutes(date: Date, amount: number): Date {
    return addMinutes(date, amount)
  }

  addHours(date: Date, amount: number): Date {
    return addHours(date, amount)
  }

  addDays(date: Date, amount: number): Date {
    return addDays(date, amount)
  }

  addWeeks(date: Date, amount: number): Date {
    return addWeeks(date, amount)
  }

  addMonths(date: Date, amount: number): Date {
    return addMonths(date, amount)
  }

  // === Date Boundaries ===

  startOfDay(date: Date): Date {
    return startOfDay(date)
  }

  endOfDay(date: Date): Date {
    return endOfDay(date)
  }

  startOfWeek(date: Date, firstDayOfWeek?: number): Date {
    return startOfWeek(date, {
      weekStartsOn: (firstDayOfWeek ?? this.firstDayOfWeek) as 0 | 1 | 2 | 3 | 4 | 5 | 6,
      locale: this.dateFnsLocale,
    })
  }

  endOfWeek(date: Date, firstDayOfWeek?: number): Date {
    return endOfWeek(date, {
      weekStartsOn: (firstDayOfWeek ?? this.firstDayOfWeek) as 0 | 1 | 2 | 3 | 4 | 5 | 6,
      locale: this.dateFnsLocale,
    })
  }

  startOfMonth(date: Date): Date {
    return startOfMonth(date)
  }

  endOfMonth(date: Date): Date {
    return endOfMonth(date)
  }

  startOfYear(date: Date): Date {
    return startOfYear(date)
  }

  endOfYear(date: Date): Date {
    return endOfYear(date)
  }

  // === Comparison ===

  isEqual(date: Date, comparing: Date): boolean {
    return isEqual(date, comparing)
  }

  isAfter(date: Date, comparing: Date): boolean {
    return isAfter(date, comparing)
  }

  isBefore(date: Date, comparing: Date): boolean {
    return isBefore(date, comparing)
  }

  isAfterDay(date: Date, comparing: Date): boolean {
    return isAfter(startOfDay(date), startOfDay(comparing))
  }

  isSameDay(date: Date, comparing: Date): boolean {
    return isSameDay(date, comparing)
  }

  isSameMonth(date: Date, comparing: Date): boolean {
    return isSameMonth(date, comparing)
  }

  isSameYear(date: Date, comparing: Date): boolean {
    return isSameYear(date, comparing)
  }

  isValid(date: unknown): boolean {
    if (date === null || date === undefined) {
      return false
    }
    const parsed = this.date(date)
    return parsed !== null && isValid(parsed)
  }

  isWithinRange(date: Date, range: [Date, Date]): boolean {
    return isWithinInterval(date, { start: range[0], end: range[1] })
  }

  // === Getters ===

  getYear(date: Date): number {
    return getYear(date)
  }

  getMonth(date: Date): number {
    return getMonth(date)
  }

  getDate(date: Date): number {
    return getDate(date)
  }

  getHours(date: Date): number {
    return getHours(date)
  }

  getMinutes(date: Date): number {
    return getMinutes(date)
  }

  getWeek(date: Date, firstDayOfWeek?: number): number {
    return getWeek(date, {
      weekStartsOn: (firstDayOfWeek ?? this.firstDayOfWeek) as 0 | 1 | 2 | 3 | 4 | 5 | 6,
      locale: this.dateFnsLocale,
    })
  }

  getWeekdays(
    firstDayOfWeek?: number,
    weekdayFormat: 'long' | 'short' | 'narrow' = 'long'
  ): string[] {
    const first = firstDayOfWeek ?? this.firstDayOfWeek
    const weekdays: string[] = []

    // Start from a known Sunday (Jan 1, 2023)
    const baseDate = new Date(2023, 0, 1)
    const startDate = this.startOfWeek(baseDate, first)

    const formatMap = {
      long: 'EEEE',
      short: 'EEE',
      narrow: 'EEEEE',
    }

    for (let i = 0; i < 7; i++) {
      const date = addDays(startDate, i)
      weekdays.push(format(date, formatMap[weekdayFormat], { locale: this.dateFnsLocale }))
    }

    return weekdays
  }

  getNextMonth(date: Date): Date {
    return addMonths(date, 1)
  }

  getPreviousMonth(date: Date): Date {
    return addMonths(date, -1)
  }

  // === Setters ===

  setYear(date: Date, year: number): Date {
    return setYear(date, year)
  }

  setMonth(date: Date, month: number): Date {
    return setMonth(date, month)
  }

  setDate(date: Date, day: number): Date {
    return setDate(date, day)
  }

  setHours(date: Date, hours: number): Date {
    return setHours(date, hours)
  }

  setMinutes(date: Date, minutes: number): Date {
    return setMinutes(date, minutes)
  }

  // === Utilities ===

  format(date: Date, formatString: string): string {
    const formatPattern = this.formats[formatString] ?? formatString
    return format(date, formatPattern, { locale: this.dateFnsLocale })
  }

  getDiff(
    date: Date,
    comparing: Date | string,
    unit: 'days' | 'months' | 'years' | 'hours' | 'minutes' = 'days'
  ): number {
    const compareDate = typeof comparing === 'string' ? this.parseISO(comparing) : comparing

    switch (unit) {
      case 'years':
        return differenceInYears(date, compareDate)
      case 'months':
        return differenceInMonths(date, compareDate)
      case 'days':
        return differenceInDays(date, compareDate)
      case 'hours':
        return differenceInHours(date, compareDate)
      case 'minutes':
        return differenceInMinutes(date, compareDate)
      default:
        return differenceInDays(date, compareDate)
    }
  }

  getWeekArray(date: Date, firstDayOfWeek?: number): Date[][] {
    const first = firstDayOfWeek ?? this.firstDayOfWeek
    const start = this.startOfWeek(this.startOfMonth(date), first)
    const end = this.endOfWeek(this.endOfMonth(date), first)

    const weeks: Date[][] = []
    let currentWeek: Date[] = []
    let current = start

    while (isBefore(current, end) || isEqual(current, end)) {
      currentWeek.push(startOfDay(current))

      if (currentWeek.length === 7) {
        weeks.push(currentWeek)
        currentWeek = []
      }

      current = addDays(current, 1)
    }

    if (currentWeek.length > 0) {
      weeks.push(currentWeek)
    }

    return weeks
  }
}
