/**
 * @module V0DateAdapter
 *
 * @remarks
 * Default DateAdapter for v0, built on the Temporal API.
 * Uses Temporal.PlainDateTime as the primary date type.
 *
 * Implements the full date-io IUtils interface for industry compatibility.
 *
 * Requires native Temporal support or @js-temporal/polyfill.
 *
 * @see https://tc39.es/proposal-temporal/docs/
 * @see https://github.com/dmtrKovalenko/date-io
 */

import { Temporal } from '@js-temporal/polyfill'
import type { DateAdapter } from './adapter'

type PlainDateTime = Temporal.PlainDateTime

/**
 * Converts a day-of-week value to a number (0=Sunday, 1=Monday, etc.)
 * Accepts number or string (for Vuetify 3 compatibility)
 */
function parseDayOfWeek (value: number | string | undefined, defaultValue = 0): number {
  if (value == null) return defaultValue
  if (typeof value === 'number') return value

  // Handle string day names
  const dayMap: Record<string, number> = {
    sunday: 0, sun: 0,
    monday: 1, mon: 1,
    tuesday: 2, tue: 2,
    wednesday: 3, wed: 3,
    thursday: 4, thu: 4,
    friday: 5, fri: 5,
    saturday: 6, sat: 6,
  }

  const lower = value.toLowerCase()
  return dayMap[lower] ?? (Number.parseInt(value, 10) || defaultValue)
}

export class V0DateAdapter implements DateAdapter<PlainDateTime> {
  locale: string

  constructor (locale = 'en-US') {
    this.locale = locale
  }

  // ============================================
  // Construction & Conversion
  // ============================================

  date (value?: unknown): PlainDateTime | null {
    if (value == null) {
      return Temporal.Now.plainDateTimeISO()
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
        return Temporal.PlainDateTime.from(value)
      } catch {
        // Try parsing as ISO date string
        try {
          return this.parseISO(value)
        } catch {
          return null
        }
      }
    }

    if (typeof value === 'number') {
      const date = new Date(value)

      return Temporal.PlainDateTime.from({
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
        hour: date.getHours(),
        minute: date.getMinutes(),
        second: date.getSeconds(),
        millisecond: date.getMilliseconds(),
      })
    }

    return null
  }

  toJsDate (value: PlainDateTime): Date {
    return new Date(
      value.year,
      value.month - 1,
      value.day,
      value.hour,
      value.minute,
      value.second,
      value.millisecond,
    )
  }

  parseISO (dateString: string): PlainDateTime {
    // Handle date-only strings
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return Temporal.PlainDate.from(dateString).toPlainDateTime()
    }

    // Handle full datetime strings
    return Temporal.PlainDateTime.from(dateString)
  }

  toISO (date: PlainDateTime): string {
    return date.toString()
  }

  parse (value: string, _format: string): PlainDateTime | null {
    // Note: Custom format parsing is complex with Temporal API
    // For now, attempt to parse common formats
    try {
      return this.date(value)
    } catch {
      return null
    }
  }

  isValid (date: unknown): boolean {
    if (date == null) return false

    if (date instanceof Temporal.PlainDateTime) return true
    if (date instanceof Temporal.PlainDate) return true
    if (date instanceof Temporal.ZonedDateTime) return true

    if (date instanceof Date) {
      return !Number.isNaN(date.getTime())
    }

    if (typeof date === 'string') {
      try {
        Temporal.PlainDateTime.from(date)

        return true
      } catch {
        try {
          Temporal.PlainDate.from(date)

          return true
        } catch {
          return false
        }
      }
    }

    return false
  }

  isNull (value: PlainDateTime | null): boolean {
    return value == null
  }

  // ============================================
  // Locale & Formatting
  // ============================================

  getCurrentLocaleCode (): string {
    return this.locale
  }

  is12HourCycleInCurrentLocale (): boolean {
    const formatOptions = new Intl.DateTimeFormat(this.locale, { hour: 'numeric' }).resolvedOptions()
    return formatOptions.hour12 ?? false
  }

  format (date: PlainDateTime, formatString: string): string {
    const jsDate = this.toJsDate(date)

    // Predefined format presets
    const presets: Record<string, Intl.DateTimeFormatOptions> = {
      fullDate: { dateStyle: 'full' },
      fullDateWithWeekday: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
      normalDate: { dateStyle: 'medium' },
      shortDate: { dateStyle: 'short' },
      year: { year: 'numeric' },
      month: { month: 'long' },
      monthShort: { month: 'short' },
      monthAndYear: { year: 'numeric', month: 'long' },
      monthAndDate: { month: 'long', day: 'numeric' },
      weekday: { weekday: 'long' },
      weekdayShort: { weekday: 'short' },
      dayOfMonth: { day: 'numeric' },
      hours12h: { hour: 'numeric', hour12: true },
      hours24h: { hour: 'numeric', hour12: false },
      minutes: { minute: 'numeric' },
      seconds: { second: 'numeric' },
      fullTime: { timeStyle: 'medium' },
      fullTime12h: { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true },
      fullTime24h: { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false },
      fullDateTime: { dateStyle: 'full', timeStyle: 'short' },
      fullDateTime12h: { dateStyle: 'full', hour: 'numeric', minute: 'numeric', hour12: true },
      fullDateTime24h: { dateStyle: 'full', hour: 'numeric', minute: 'numeric', hour12: false },
      keyboardDate: { year: 'numeric', month: '2-digit', day: '2-digit' },
      keyboardDateTime: { year: 'numeric', month: '2-digit', day: '2-digit', hour: 'numeric', minute: 'numeric' },
      keyboardDateTime12h: { year: 'numeric', month: '2-digit', day: '2-digit', hour: 'numeric', minute: 'numeric', hour12: true },
      keyboardDateTime24h: { year: 'numeric', month: '2-digit', day: '2-digit', hour: 'numeric', minute: 'numeric', hour12: false },
    }

    const options = presets[formatString]

    if (options) {
      return new Intl.DateTimeFormat(this.locale, options).format(jsDate)
    }

    // Fallback: try to use the format string as-is with Intl
    return new Intl.DateTimeFormat(this.locale).format(jsDate)
  }

  formatByString (date: PlainDateTime, formatString: string): string {
    // Simple token replacement for common format strings
    const jsDate = this.toJsDate(date)

    const tokens: Record<string, string> = {
      YYYY: String(date.year),
      YY: String(date.year).slice(-2),
      MM: String(date.month).padStart(2, '0'),
      M: String(date.month),
      DD: String(date.day).padStart(2, '0'),
      D: String(date.day),
      HH: String(date.hour).padStart(2, '0'),
      H: String(date.hour),
      hh: String(date.hour % 12 || 12).padStart(2, '0'),
      h: String(date.hour % 12 || 12),
      mm: String(date.minute).padStart(2, '0'),
      m: String(date.minute),
      ss: String(date.second).padStart(2, '0'),
      s: String(date.second),
      A: date.hour < 12 ? 'AM' : 'PM',
      a: date.hour < 12 ? 'am' : 'pm',
      MMMM: new Intl.DateTimeFormat(this.locale, { month: 'long' }).format(jsDate),
      MMM: new Intl.DateTimeFormat(this.locale, { month: 'short' }).format(jsDate),
      dddd: new Intl.DateTimeFormat(this.locale, { weekday: 'long' }).format(jsDate),
      ddd: new Intl.DateTimeFormat(this.locale, { weekday: 'short' }).format(jsDate),
    }

    let result = formatString

    // Replace tokens (longer tokens first to avoid partial matches)
    const sortedTokens = Object.keys(tokens).toSorted((a, b) => b.length - a.length)
    for (const token of sortedTokens) {
      const replacement = tokens[token]
      if (replacement !== undefined) {
        result = result.replace(new RegExp(token, 'g'), replacement)
      }
    }

    return result
  }

  getFormatHelperText (format: string): string {
    // Return a human-readable version of the format string
    const helperMap: Record<string, string> = {
      keyboardDate: 'mm/dd/yyyy',
      keyboardDateTime: 'mm/dd/yyyy hh:mm',
      keyboardDateTime12h: 'mm/dd/yyyy hh:mm am/pm',
      keyboardDateTime24h: 'mm/dd/yyyy hh:mm',
    }

    return helperMap[format] ?? format
      .replace(/YYYY/g, 'yyyy')
      .replace(/MM/g, 'mm')
      .replace(/DD/g, 'dd')
      .replace(/HH/g, 'hh')
      .replace(/mm/g, 'mm')
      .replace(/ss/g, 'ss')
  }

  formatNumber (numberToFormat: string): string {
    return new Intl.NumberFormat(this.locale).format(Number(numberToFormat))
  }

  getMeridiemText (ampm: 'am' | 'pm'): string {
    const date = ampm === 'am'
      ? new Date(2020, 0, 1, 9, 0)
      : new Date(2020, 0, 1, 15, 0)

    const formatted = new Intl.DateTimeFormat(this.locale, {
      hour: 'numeric',
      hour12: true,
    }).format(date)

    // Extract the AM/PM text from the formatted string
    const match = formatted.match(/[AP]M|[ap]m|午前|午後|上午|下午/i)
    return match ? match[0] : ampm.toUpperCase()
  }

  // ============================================
  // Navigation - Start/End boundaries
  // ============================================

  startOfDay (date: PlainDateTime): PlainDateTime {
    return date.with({ hour: 0, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 })
  }

  endOfDay (date: PlainDateTime): PlainDateTime {
    return date.with({ hour: 23, minute: 59, second: 59, millisecond: 999, microsecond: 999, nanosecond: 999 })
  }

  startOfWeek (date: PlainDateTime, firstDayOfWeek: number | string = 0): PlainDateTime {
    const first = parseDayOfWeek(firstDayOfWeek, 0)
    const dayOfWeek = date.dayOfWeek % 7 // Temporal: 1=Mon...7=Sun, we want 0=Sun
    const diff = (dayOfWeek - first + 7) % 7

    return this.startOfDay(date.subtract({ days: diff }))
  }

  endOfWeek (date: PlainDateTime): PlainDateTime {
    const start = this.startOfWeek(date, 0)

    return this.endOfDay(start.add({ days: 6 }))
  }

  startOfMonth (date: PlainDateTime): PlainDateTime {
    return this.startOfDay(date.with({ day: 1 }))
  }

  endOfMonth (date: PlainDateTime): PlainDateTime {
    return this.endOfDay(date.with({ day: date.daysInMonth }))
  }

  startOfYear (date: PlainDateTime): PlainDateTime {
    return this.startOfDay(date.with({ month: 1, day: 1 }))
  }

  endOfYear (date: PlainDateTime): PlainDateTime {
    return this.endOfDay(date.with({ month: 12, day: 31 }))
  }

  // ============================================
  // Arithmetic
  // ============================================

  addSeconds (date: PlainDateTime, amount: number): PlainDateTime {
    return date.add({ seconds: amount })
  }

  addMinutes (date: PlainDateTime, amount: number): PlainDateTime {
    return date.add({ minutes: amount })
  }

  addHours (date: PlainDateTime, amount: number): PlainDateTime {
    return date.add({ hours: amount })
  }

  addDays (date: PlainDateTime, amount: number): PlainDateTime {
    return date.add({ days: amount })
  }

  addWeeks (date: PlainDateTime, amount: number): PlainDateTime {
    return date.add({ weeks: amount })
  }

  addMonths (date: PlainDateTime, amount: number): PlainDateTime {
    return date.add({ months: amount })
  }

  addYears (date: PlainDateTime, amount: number): PlainDateTime {
    return date.add({ years: amount })
  }

  // ============================================
  // Comparison
  // ============================================

  isAfter (date: PlainDateTime, comparing: PlainDateTime): boolean {
    return Temporal.PlainDateTime.compare(date, comparing) > 0
  }

  isAfterDay (date: PlainDateTime, comparing: PlainDateTime): boolean {
    return Temporal.PlainDate.compare(date.toPlainDate(), comparing.toPlainDate()) > 0
  }

  isAfterMonth (date: PlainDateTime, comparing: PlainDateTime): boolean {
    if (date.year !== comparing.year) {
      return date.year > comparing.year
    }
    return date.month > comparing.month
  }

  isAfterYear (date: PlainDateTime, comparing: PlainDateTime): boolean {
    return date.year > comparing.year
  }

  isBefore (date: PlainDateTime, comparing: PlainDateTime): boolean {
    return Temporal.PlainDateTime.compare(date, comparing) < 0
  }

  isBeforeDay (date: PlainDateTime, comparing: PlainDateTime): boolean {
    return Temporal.PlainDate.compare(date.toPlainDate(), comparing.toPlainDate()) < 0
  }

  isBeforeMonth (date: PlainDateTime, comparing: PlainDateTime): boolean {
    if (date.year !== comparing.year) {
      return date.year < comparing.year
    }
    return date.month < comparing.month
  }

  isBeforeYear (date: PlainDateTime, comparing: PlainDateTime): boolean {
    return date.year < comparing.year
  }

  isEqual (date: PlainDateTime, comparing: PlainDateTime): boolean {
    return Temporal.PlainDateTime.compare(date, comparing) === 0
  }

  isSameDay (date: PlainDateTime, comparing: PlainDateTime): boolean {
    return Temporal.PlainDate.compare(date.toPlainDate(), comparing.toPlainDate()) === 0
  }

  isSameMonth (date: PlainDateTime, comparing: PlainDateTime): boolean {
    return date.year === comparing.year && date.month === comparing.month
  }

  isSameYear (date: PlainDateTime, comparing: PlainDateTime): boolean {
    return date.year === comparing.year
  }

  isSameHour (date: PlainDateTime, comparing: PlainDateTime): boolean {
    return date.year === comparing.year &&
      date.month === comparing.month &&
      date.day === comparing.day &&
      date.hour === comparing.hour
  }

  isWithinRange (date: PlainDateTime, [start, end]: [PlainDateTime, PlainDateTime]): boolean {
    return Temporal.PlainDateTime.compare(date, start) >= 0 &&
      Temporal.PlainDateTime.compare(date, end) <= 0
  }

  // ============================================
  // Getters
  // ============================================

  getYear (date: PlainDateTime): number {
    return date.year
  }

  getMonth (date: PlainDateTime): number {
    return date.month - 1 // Return 0-indexed for consistency with JS Date
  }

  getDate (date: PlainDateTime): number {
    return date.day
  }

  getHours (date: PlainDateTime): number {
    return date.hour
  }

  getMinutes (date: PlainDateTime): number {
    return date.minute
  }

  getSeconds (date: PlainDateTime): number {
    return date.second
  }

  getDiff (
    date: PlainDateTime,
    comparing: PlainDateTime | string,
    unit?: string,
  ): number {
    const unitKey = (unit ?? 'days') as 'years' | 'months' | 'weeks' | 'days' | 'hours' | 'minutes' | 'seconds'
    const comp = typeof comparing === 'string' ? this.parseISO(comparing) : comparing
    const duration = date.since(comp, { largestUnit: unitKey })

    switch (unitKey) {
      case 'years': { return duration.years
      }
      case 'months': { return duration.months + duration.years * 12
      }
      case 'weeks': { return duration.weeks + Math.floor(duration.days / 7)
      }
      case 'days': { return duration.days + duration.weeks * 7
      }
      case 'hours': { return Math.round(duration.total({ unit: 'hours' }))
      }
      case 'minutes': { return Math.round(duration.total({ unit: 'minutes' }))
      }
      case 'seconds': { return Math.round(duration.total({ unit: 'seconds' }))
      }
      default: { return duration.days
      }
    }
  }

  getWeek (date: PlainDateTime, firstDayOfWeek: number | string = 0, firstDayOfYear: number | string = 1): number {
    const first = parseDayOfWeek(firstDayOfWeek, 0)
    const minimalDays = typeof firstDayOfYear === 'string' ? Number.parseInt(firstDayOfYear, 10) || 1 : firstDayOfYear
    const startOfYear = this.startOfYear(date)
    const startOfFirstWeek = this.startOfWeek(startOfYear, first)

    // Adjust if the first week doesn't have enough days
    let firstWeekStart = startOfFirstWeek

    if (startOfYear.day - startOfFirstWeek.day < minimalDays) {
      firstWeekStart = startOfFirstWeek.add({ weeks: 1 })
    }

    const startOfCurrentWeek = this.startOfWeek(date, first)
    const diff = this.getDiff(startOfCurrentWeek, firstWeekStart, 'weeks')

    return Math.max(1, diff + 1)
  }

  getDaysInMonth (date: PlainDateTime): number {
    return date.daysInMonth
  }

  // ============================================
  // Setters (return new instance - immutable)
  // ============================================

  setYear (date: PlainDateTime, year: number): PlainDateTime {
    return date.with({ year })
  }

  setMonth (date: PlainDateTime, month: number): PlainDateTime {
    return date.with({ month: month + 1 }) // Accept 0-indexed for consistency
  }

  setDate (date: PlainDateTime, day: number): PlainDateTime {
    return date.with({ day })
  }

  setHours (date: PlainDateTime, hours: number): PlainDateTime {
    return date.with({ hour: hours })
  }

  setMinutes (date: PlainDateTime, minutes: number): PlainDateTime {
    return date.with({ minute: minutes })
  }

  setSeconds (date: PlainDateTime, seconds: number): PlainDateTime {
    return date.with({ second: seconds })
  }

  // ============================================
  // Calendar Utilities
  // ============================================

  getWeekdays (firstDayOfWeek: number | string = 0, format: 'long' | 'short' | 'narrow' = 'short'): string[] {
    const first = parseDayOfWeek(firstDayOfWeek, 0)
    const weekdays: string[] = []
    // Use a known Sunday as reference (Jan 4, 2015 is a Sunday)
    const refDate = Temporal.PlainDate.from('2015-01-04')

    for (let i = 0; i < 7; i++) {
      const day = refDate.add({ days: (i + first) % 7 })
      const jsDate = new Date(day.year, day.month - 1, day.day)

      weekdays.push(
        new Intl.DateTimeFormat(this.locale, { weekday: format }).format(jsDate),
      )
    }

    return weekdays
  }

  getWeekArray (date: PlainDateTime, firstDayOfWeek: number | string = 0): PlainDateTime[][] {
    const first = parseDayOfWeek(firstDayOfWeek, 0)
    const weeks: PlainDateTime[][] = []
    const monthStart = this.startOfMonth(date)
    const monthEnd = this.endOfMonth(date)

    let current = this.startOfWeek(monthStart, first)
    const end = this.endOfWeek(monthEnd)

    while (Temporal.PlainDateTime.compare(current, end) <= 0) {
      const week: PlainDateTime[] = []

      for (let i = 0; i < 7; i++) {
        week.push(current)
        current = current.add({ days: 1 })
      }
      weeks.push(week)
    }

    return weeks
  }

  getMonthArray (date: PlainDateTime): PlainDateTime[] {
    const year = date.year
    const months: PlainDateTime[] = []

    for (let month = 1; month <= 12; month++) {
      months.push(Temporal.PlainDateTime.from({ year, month, day: 1 }))
    }

    return months
  }

  getYearRange (start: PlainDateTime, end: PlainDateTime): PlainDateTime[] {
    const years: PlainDateTime[] = []
    let current = start.year

    while (current <= end.year) {
      years.push(Temporal.PlainDateTime.from({ year: current, month: 1, day: 1 }))
      current++
    }

    return years
  }

  // ============================================
  // Month Navigation
  // ============================================

  getNextMonth (date: PlainDateTime): PlainDateTime {
    return this.startOfMonth(date.add({ months: 1 }))
  }

  getPreviousMonth (date: PlainDateTime): PlainDateTime {
    return this.startOfMonth(date.subtract({ months: 1 }))
  }

  // ============================================
  // Utility
  // ============================================

  mergeDateAndTime (date: PlainDateTime, time: PlainDateTime): PlainDateTime {
    return date.with({
      hour: time.hour,
      minute: time.minute,
      second: time.second,
      millisecond: time.millisecond,
    })
  }
}
