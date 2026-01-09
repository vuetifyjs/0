/**
 * @module Vuetify0DateAdapter
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

// Constants
import { IN_BROWSER } from '#v0/constants/globals'
// Polyfill
import { Temporal } from '@js-temporal/polyfill'

// Utilities
import { isNull, isNullOrUndefined, isNumber, isString } from '#v0/utilities'

// Types
import type { DateAdapter } from './adapter'

type PlainDateTime = Temporal.PlainDateTime

/** Single regex for token replacement in formatByString */
const FORMAT_TOKEN_REGEX = /YYYY|YY|MMMM|MMM|MM|M|dddd|ddd|DD|D|HH|H|hh|h|mm|m|ss|s|A|a/g

/** Maximum cache size to prevent memory leaks */
const MAX_CACHE_SIZE = 50

export class Vuetify0DateAdapter implements DateAdapter<PlainDateTime> {
  private _locale: string

  /** Cache for Intl.DateTimeFormat instances, keyed by locale + options */
  private formatCache = new Map<string, Intl.DateTimeFormat>()

  /** Cache for Intl.NumberFormat instances, keyed by locale */
  private numberFormatCache = new Map<string, Intl.NumberFormat>()

  constructor (locale = 'en-US') {
    this._locale = locale
  }

  /** Current locale. Setting a new locale clears format caches. */
  get locale (): string {
    return this._locale
  }

  set locale (value: string) {
    if (this._locale !== value) {
      this._locale = value
      this.formatCache.clear()
      this.numberFormatCache.clear()
    }
  }

  // ============================================
  // Construction & Conversion
  // ============================================

  /**
   * Create a date from various input types.
   *
   * @param value - Date value (PlainDateTime, PlainDate, ZonedDateTime, Date, ISO string, timestamp)
   * @returns PlainDateTime or null if invalid
   *
   * @remarks
   * **SSR Safety:** When called without arguments:
   * - Browser: Returns current time via `Temporal.Now.plainDateTimeISO()`
   * - Server: Returns epoch (1970-01-01T00:00:00) for deterministic rendering
   *
   * For SSR apps needing current time, pass `Date.now()` explicitly and handle
   * hydration via `<ClientOnly>` (Nuxt) or `v-if` + `onMounted` pattern.
   */
  date (value?: unknown): PlainDateTime | null {
    if (isNullOrUndefined(value)) {
      // SSR safety: Temporal.Now requires browser environment
      return IN_BROWSER
        ? Temporal.Now.plainDateTimeISO()
        : Temporal.PlainDateTime.from({ year: 1970, month: 1, day: 1, hour: 0, minute: 0, second: 0 })
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

    if (isString(value)) {
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

    if (isNumber(value)) {
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

  /**
   * Parses a date string into a PlainDateTime.
   *
   * **Known limitation**: The `format` parameter is currently ignored.
   * Temporal API doesn't provide built-in format parsing, and implementing
   * full format string parsing (e.g., 'MM/DD/YYYY') would require a
   * substantial custom parser. This method delegates to `date()` which
   * handles ISO 8601 strings and common formats.
   *
   * For custom format parsing, consider using a library like date-fns or
   * luxon with a custom adapter.
   *
   * @param value - The date string to parse
   * @param _format - Format hint (currently ignored)
   * @returns Parsed PlainDateTime or null if invalid
   */
  parse (value: string, _format: string): PlainDateTime | null {
    try {
      return this.date(value)
    } catch {
      return null
    }
  }

  isValid (date: unknown): date is PlainDateTime {
    if (isNullOrUndefined(date)) return false

    if (date instanceof Temporal.PlainDateTime) return true
    if (date instanceof Temporal.PlainDate) return true
    if (date instanceof Temporal.ZonedDateTime) return true

    if (date instanceof Date) {
      return !Number.isNaN(date.getTime())
    }

    if (isString(date)) {
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

  isNull (value: PlainDateTime | null): value is null {
    return isNullOrUndefined(value)
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
      return this.getFormatter(options).format(jsDate)
    }

    // Fallback: try to use the format string as-is with Intl
    return this.getFormatter({}).format(jsDate)
  }

  formatByString (date: PlainDateTime, formatString: string): string {
    // Simple token replacement for common format strings
    const jsDate = this.toJsDate(date)

    // Build token values lazily - only compute Intl formats if needed
    const getTokenValue = (token: string): string => {
      switch (token) {
        case 'YYYY': { return String(date.year) }
        case 'YY': { return String(date.year).slice(-2) }
        case 'MM': { return String(date.month).padStart(2, '0') }
        case 'M': { return String(date.month) }
        case 'DD': { return String(date.day).padStart(2, '0') }
        case 'D': { return String(date.day) }
        case 'HH': { return String(date.hour).padStart(2, '0') }
        case 'H': { return String(date.hour) }
        case 'hh': { return String(date.hour % 12 || 12).padStart(2, '0') }
        case 'h': { return String(date.hour % 12 || 12) }
        case 'mm': { return String(date.minute).padStart(2, '0') }
        case 'm': { return String(date.minute) }
        case 'ss': { return String(date.second).padStart(2, '0') }
        case 's': { return String(date.second) }
        case 'A': { return date.hour < 12 ? 'AM' : 'PM' }
        case 'a': { return date.hour < 12 ? 'am' : 'pm' }
        case 'MMMM': { return this.getFormatter({ month: 'long' }).format(jsDate) }
        case 'MMM': { return this.getFormatter({ month: 'short' }).format(jsDate) }
        case 'dddd': { return this.getFormatter({ weekday: 'long' }).format(jsDate) }
        case 'ddd': { return this.getFormatter({ weekday: 'short' }).format(jsDate) }
        default: { return token }
      }
    }

    // Use pre-compiled regex for single-pass replacement
    return formatString.replace(FORMAT_TOKEN_REGEX, match => getTokenValue(match))
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
    return this.getNumberFormatter().format(Number(numberToFormat))
  }

  getMeridiemText (ampm: 'am' | 'pm'): string {
    const date = ampm === 'am'
      ? new Date(2020, 0, 1, 9, 0)
      : new Date(2020, 0, 1, 15, 0)

    const formatted = this.getFormatter({ hour: 'numeric', hour12: true }).format(date)

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

  startOfWeek (date: PlainDateTime, firstDayOfWeek = 0): PlainDateTime {
    const dayOfWeek = date.dayOfWeek % 7 // Temporal: 1=Mon...7=Sun, we want 0=Sun
    const diff = (dayOfWeek - firstDayOfWeek + 7) % 7

    return this.startOfDay(date.subtract({ days: diff }))
  }

  endOfWeek (date: PlainDateTime, firstDayOfWeek = 0): PlainDateTime {
    const start = this.startOfWeek(date, firstDayOfWeek)

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
    const comp = isString(comparing) ? this.date(comparing) : comparing

    if (isNull(comp)) return 0

    const duration = date.since(comp, { largestUnit: unitKey })

    switch (unitKey) {
      case 'years': { return duration.years }
      case 'months': { return duration.months + duration.years * 12 }
      case 'weeks': { return duration.weeks + Math.floor(duration.days / 7) }
      case 'days': { return duration.days + duration.weeks * 7 }
      case 'hours': { return Math.round(duration.total({ unit: 'hours' })) }
      case 'minutes': { return Math.round(duration.total({ unit: 'minutes' })) }
      case 'seconds': { return Math.round(duration.total({ unit: 'seconds' })) }
      default: { return duration.days }
    }
  }

  getWeek (date: PlainDateTime, firstDayOfWeek = 0, minimalDays = 1): number {
    const startOfYear = this.startOfYear(date)
    const startOfFirstWeek = this.startOfWeek(startOfYear, firstDayOfWeek)

    // Adjust if the first week doesn't have enough days
    let firstWeekStart = startOfFirstWeek

    if (startOfYear.day - startOfFirstWeek.day < minimalDays) {
      firstWeekStart = startOfFirstWeek.add({ weeks: 1 })
    }

    const startOfCurrentWeek = this.startOfWeek(date, firstDayOfWeek)
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

  getWeekdays (firstDayOfWeek = 0, format: 'long' | 'short' | 'narrow' = 'short'): string[] {
    const weekdays: string[] = []
    // Use a known Sunday as reference (Jan 4, 2015 is a Sunday)
    const refDate = Temporal.PlainDate.from('2015-01-04')
    const formatter = this.getFormatter({ weekday: format })

    for (let i = 0; i < 7; i++) {
      const day = refDate.add({ days: (i + firstDayOfWeek) % 7 })
      const jsDate = new Date(day.year, day.month - 1, day.day)

      weekdays.push(formatter.format(jsDate))
    }

    return weekdays
  }

  getWeekArray (date: PlainDateTime, firstDayOfWeek = 0): PlainDateTime[][] {
    const weeks: PlainDateTime[][] = []
    const monthStart = this.startOfMonth(date)
    const monthEnd = this.endOfMonth(date)

    let current = this.startOfWeek(monthStart, firstDayOfWeek)
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

  // ============================================
  // Private Helpers
  // ============================================

  /**
   * Gets a cached Intl.DateTimeFormat instance or creates one if not cached.
   * Cache is limited to MAX_CACHE_SIZE entries to prevent memory leaks.
   */
  private getFormatter (options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
    const key = `${this.locale}:${JSON.stringify(options)}`
    let formatter = this.formatCache.get(key)

    if (!formatter) {
      // Evict oldest entry if cache is full
      if (this.formatCache.size >= MAX_CACHE_SIZE) {
        const firstKey = this.formatCache.keys().next().value
        if (firstKey) this.formatCache.delete(firstKey)
      }

      formatter = new Intl.DateTimeFormat(this.locale, options)
      this.formatCache.set(key, formatter)
    }

    return formatter
  }

  /**
   * Gets a cached Intl.NumberFormat instance or creates one if not cached.
   * Cache is limited to MAX_CACHE_SIZE entries to prevent memory leaks.
   */
  private getNumberFormatter (): Intl.NumberFormat {
    let formatter = this.numberFormatCache.get(this.locale)

    if (!formatter) {
      // Evict oldest entry if cache is full
      if (this.numberFormatCache.size >= MAX_CACHE_SIZE) {
        const firstKey = this.numberFormatCache.keys().next().value
        if (firstKey) this.numberFormatCache.delete(firstKey)
      }

      formatter = new Intl.NumberFormat(this.locale)
      this.numberFormatCache.set(this.locale, formatter)
    }

    return formatter
  }
}
