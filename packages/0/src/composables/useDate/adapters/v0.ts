/**
 * @module V0DateAdapter
 *
 * @remarks
 * Temporal `DateAdapter`. Opt in with `new V0DateAdapter()`.
 * `PlainDateAdapter` is the default and does not load this module.
 * Uses Temporal.PlainDateTime as the primary date type.
 *
 * Implements the full date-io IUtils interface for industry compatibility.
 *
 * Uses the runtime's native Temporal implementation when present, falling back
 * to the @js-temporal/polyfill optional peer. The polyfill import is static, so
 * runtimes without native Temporal must have the peer installed to load this
 * module. Until V8 implements calendar duration math, any calendar other than
 * iso8601 is computed with the polyfill. Non-ISO add and subtract still throw
 * in the Temporal that Node 26 and Chrome ship, and with({ month }) skips leap
 * months. The iso8601 path keeps the runtime Temporal.
 *
 * @see https://tc39.es/proposal-temporal/docs/
 * @see https://github.com/dmtrKovalenko/date-io
 */

// Polyfill
import { Temporal as polyfill } from '@js-temporal/polyfill'

// Globals
import { IN_BROWSER } from '#v0/constants/globals'

// Adapters
import { DateAdapter } from './adapter'

// Utilities
import { isFunction, isNull, isNullOrUndefined, isNumber, isString } from '#v0/utilities'

// Week info
import { deriveWeekInfo } from '../weekinfo'

/** Resolved Temporal implementation — native when the runtime provides it, polyfill otherwise. */
export const Temporal = (globalThis as unknown as { Temporal?: typeof polyfill }).Temporal ?? polyfill

type PlainDateTime = polyfill.PlainDateTime

/** Single regex for token replacement in formatByString */
const FORMAT_TOKEN_REGEX = /YYYY|YY|MMMM|MMM|MM|M|dddd|ddd|DD|D|HH|H|hh|h|mm|m|ss|s|A|a/g

/** Maximum cache size to prevent memory leaks */
const MAX_CACHE_SIZE = 50

export interface V0DateAdapterOptions {
  /**
   * Calendar system for date fields, arithmetic and formatting, as a Temporal/Intl
   * calendar identifier (e.g. 'persian', 'hebrew', 'islamic-umalqura').
   *
   * Anything other than `iso8601` is computed with `@js-temporal/polyfill` until
   * V8 implements calendar duration math. An unknown identifier throws `RangeError`
   * at construction, and the calendar stays fixed for the life of the instance.
   *
   * @default 'iso8601'
   *
   * @example
   * ```ts
   * const persian = new V0DateAdapter('fa-IR', { calendar: 'persian' })
   * ```
   */
  calendar?: string
}

export class V0DateAdapter extends DateAdapter<PlainDateTime> {
  private _locale: string
  private _firstDayOfWeek = 0
  private _minimalDays = 1
  private _calendar: string

  /**
   * `iso8601` uses the runtime Temporal. Every other calendar uses the polyfill
   * until V8 implements calendar duration math.
   */
  private readonly engine: typeof polyfill

  /** Cache for Intl.DateTimeFormat instances, keyed by locale + options */
  private formatCache = new Map<string, Intl.DateTimeFormat>()

  /** Cache for Intl.NumberFormat instances, keyed by locale */
  private numberFormatCache = new Map<string, Intl.NumberFormat>()

  constructor (locale = 'en-US', options: V0DateAdapterOptions = {}) {
    super()
    this._locale = locale
    // Probe the polyfill so an unknown id throws here. Until V8 implements
    // calendar duration math, every calendar other than iso8601 stays on the
    // polyfill: non-ISO add/subtract throw in V8, and with({ month }) skips
    // leap months.
    const calendar = new polyfill.PlainDate(1970, 1, 1, options.calendar).calendarId
    this._calendar = calendar
    this.engine = calendar === 'iso8601' ? Temporal : polyfill
    const info = deriveWeekInfo(locale)
    this._firstDayOfWeek = info.firstDay
    this._minimalDays = info.minimalDays
  }

  /** Current locale. Setting a new locale clears format caches. */
  get locale (): string {
    return this._locale
  }

  get firstDayOfWeek (): number {
    return this._firstDayOfWeek
  }

  set locale (value: string) {
    if (this._locale !== value) {
      this._locale = value
      const info = deriveWeekInfo(value)
      this._firstDayOfWeek = info.firstDay
      this._minimalDays = info.minimalDays
      this.formatCache.clear()
      this.numberFormatCache.clear()
    }
  }

  set firstDayOfWeek (value: number) {
    this._firstDayOfWeek = value
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
    const date = this.toDateTime(value)

    return date && this.inCalendar(date)
  }

  toJsDate (value: PlainDateTime): Date {
    const iso = value.withCalendar('iso8601')

    return new Date(
      iso.year,
      iso.month - 1,
      iso.day,
      iso.hour,
      iso.minute,
      iso.second,
      iso.millisecond,
    )
  }

  parseISO (dateString: string): PlainDateTime {
    // Handle date-only strings
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return this.inCalendar(this.engine.PlainDate.from(dateString).toPlainDateTime())
    }

    // Handle timezone-aware strings (e.g., "2024-06-15T10:30:00Z" or "2024-06-15T10:30:00+05:00")
    // Convert to Instant first, then to PlainDateTime in UTC
    if (dateString.includes('Z') || /[+-]\d{2}:\d{2}$/.test(dateString)) {
      const instant = this.engine.Instant.from(dateString)
      return this.inCalendar(instant.toZonedDateTimeISO('UTC').toPlainDateTime())
    }

    // Handle full datetime strings without timezone
    return this.inCalendar(this.engine.PlainDateTime.from(dateString))
  }

  toISO (date: PlainDateTime): string {
    return date.toPlainDate().toString({ calendarName: 'never' })
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

    if (this.isEngineDate(date, this.engine)) return true

    const foreign = this.foreignEngine()
    if (foreign && this.isEngineDate(date, foreign)) return true

    if (date instanceof Date) {
      return !Number.isNaN(date.getTime())
    }

    if (isString(date)) {
      try {
        this.engine.PlainDateTime.from(date)

        return true
      } catch {
        try {
          this.engine.PlainDate.from(date)

          return true
        } catch {
          return false
        }
      }
    }

    return false
  }

  isNullish (value: PlainDateTime | null): value is null {
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
      fullTime: { timeStyle: 'short' },
      fullTime12h: { hour: 'numeric', minute: 'numeric', hour12: true },
      fullTime24h: { hour: 'numeric', minute: 'numeric', hour12: false },
      fullDateTime: { dateStyle: 'full', timeStyle: 'short' },
      fullDateTime12h: { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long', hour: 'numeric', minute: 'numeric', hour12: true },
      fullDateTime24h: { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long', hour: 'numeric', minute: 'numeric', hour12: false },
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
    const match = formatted.match(/[ap]m|午前|午後|上午|下午/i)
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

  startOfWeek (date: PlainDateTime): PlainDateTime {
    const dayOfWeek = date.dayOfWeek % 7 // Temporal: 1=Mon...7=Sun, we want 0=Sun
    const diff = (dayOfWeek - this.firstDayOfWeek + 7) % 7

    return this.startOfDay(date.subtract({ days: diff }))
  }

  endOfWeek (date: PlainDateTime): PlainDateTime {
    const start = this.startOfWeek(date)

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
    return this.endOfDay(date.with({ month: date.monthsInYear, day: 31 }))
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
    return this.engine.PlainDateTime.compare(date, comparing) > 0
  }

  isAfterDay (date: PlainDateTime, comparing: PlainDateTime): boolean {
    return this.engine.PlainDate.compare(date.toPlainDate(), comparing.toPlainDate()) > 0
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
    return this.engine.PlainDateTime.compare(date, comparing) < 0
  }

  isBeforeDay (date: PlainDateTime, comparing: PlainDateTime): boolean {
    return this.engine.PlainDate.compare(date.toPlainDate(), comparing.toPlainDate()) < 0
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
    return this.engine.PlainDateTime.compare(date, comparing) === 0
  }

  isSameDay (date: PlainDateTime, comparing: PlainDateTime): boolean {
    return this.engine.PlainDate.compare(date.toPlainDate(), comparing.toPlainDate()) === 0
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
    return this.engine.PlainDateTime.compare(date, start) >= 0 &&
      this.engine.PlainDateTime.compare(date, end) <= 0
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
      case 'months': { return duration.months }
      case 'weeks': { return duration.weeks }
      case 'days': { return duration.days }
      case 'hours': { return duration.hours }
      case 'minutes': { return duration.minutes }
      case 'seconds': { return duration.seconds }
      default: { return duration.days }
    }
  }

  getWeek (date: PlainDateTime, minimalDays?: number): number {
    const md = minimalDays ?? this._minimalDays
    const currentWeekStart = this.startOfWeek(date)
    const currentWeekEnd = this.addDays(currentWeekStart, 6)

    let year = this.getYear(currentWeekStart)
    if (year < this.getYear(currentWeekEnd)) {
      const nextYearStart = this.firstDayOfYear(year + 1)
      const nextYearFirstWeekSize = 7 - this.getDiff(nextYearStart, this.startOfWeek(nextYearStart), 'days')
      if (nextYearFirstWeekSize >= md) {
        year++
      }
    }

    const yearStart = this.firstDayOfYear(year)
    const firstWeekSize = 7 - this.getDiff(yearStart, this.startOfWeek(yearStart), 'days')
    const weekOneStart = firstWeekSize >= md
      ? yearStart.add({ days: firstWeekSize }).add({ weeks: -1 })
      : yearStart.add({ days: firstWeekSize })
    return 1 + this.getDiff(currentWeekStart, weekOneStart, 'weeks')
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

  getWeekdays (format: 'long' | 'short' | 'narrow' = 'narrow'): string[] {
    const weekdays: string[] = []
    // Use a known Sunday as reference (Jan 4, 2015 is a Sunday)
    const refDate = this.engine.PlainDate.from('2015-01-04')
    const formatter = this.getFormatter({ weekday: format })

    for (let i = 0; i < 7; i++) {
      const day = refDate.add({ days: (i + this.firstDayOfWeek) % 7 })
      const jsDate = new Date(day.year, day.month - 1, day.day)

      weekdays.push(formatter.format(jsDate))
    }

    return weekdays
  }

  getWeekArray (date: PlainDateTime, fixedWeeks = false): PlainDateTime[][] {
    const weeks: PlainDateTime[][] = []
    const monthStart = this.startOfMonth(date)
    const monthEnd = this.endOfMonth(date)

    let current = this.startOfWeek(monthStart)
    const end = this.endOfWeek(monthEnd)

    while (
      this.engine.PlainDateTime.compare(current, end) <= 0 ||
      (fixedWeeks && weeks.length < 6)
    ) {
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
    const months: PlainDateTime[] = []

    for (let month = 1; month <= date.monthsInYear; month++) {
      months.push(this.startOfDay(date.with({ month, day: 1 })))
    }

    return months
  }

  getYearRange (start: PlainDateTime, end: PlainDateTime): PlainDateTime[] {
    const years: PlainDateTime[] = []
    let current = start.year

    while (current <= end.year) {
      years.push(this.firstDayOfYear(current))
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

  private toDateTime (value: unknown): PlainDateTime | null {
    if (isNullOrUndefined(value)) {
      // SSR safety: Now.plainDateTimeISO requires a browser environment
      return IN_BROWSER
        ? this.engine.Now.plainDateTimeISO()
        : this.engine.PlainDateTime.from({ year: 1970, month: 1, day: 1, hour: 0, minute: 0, second: 0 })
    }

    if (this.isEngineDate(value, this.engine)) {
      return this.toPlain(value)
    }

    const foreign = this.foreignEngine()
    if (foreign && this.isEngineDate(value, foreign)) {
      return this.copy(value)
    }

    if (value instanceof Date) {
      return this.engine.PlainDateTime.from({
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
        return this.engine.PlainDateTime.from(value)
      } catch {
        try {
          return this.parseISO(value)
        } catch {
          return null
        }
      }
    }

    if (isNumber(value)) {
      const date = new Date(value)

      return this.engine.PlainDateTime.from({
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

  /** The other Temporal implementation, when this instance is not already on it. */
  private foreignEngine (): typeof polyfill | undefined {
    const other = this.engine === polyfill ? Temporal : polyfill

    return other === this.engine ? undefined : other
  }

  private isEngineDate (
    value: unknown,
    engine: typeof polyfill,
  ): value is polyfill.PlainDateTime | polyfill.PlainDate | polyfill.ZonedDateTime {
    return value instanceof engine.PlainDateTime
      || value instanceof engine.PlainDate
      || value instanceof engine.ZonedDateTime
  }

  private toPlain (
    value: polyfill.PlainDateTime | polyfill.PlainDate | polyfill.ZonedDateTime,
  ): PlainDateTime {
    if (isFunction((value as { toPlainDateTime?: unknown }).toPlainDateTime)) {
      return (value as { toPlainDateTime: () => PlainDateTime }).toPlainDateTime()
    }

    return value as PlainDateTime
  }

  /**
   * Rebuild a date from the other engine. Calendar fields are not ISO fields,
   * so the copy goes through `iso8601` before `PlainDateTime.from`.
   */
  private copy (
    value: polyfill.PlainDateTime | polyfill.PlainDate | polyfill.ZonedDateTime,
  ): PlainDateTime {
    const iso = this.toPlain(value).withCalendar('iso8601')

    return this.engine.PlainDateTime.from({
      year: iso.year,
      month: iso.month,
      day: iso.day,
      hour: iso.hour,
      minute: iso.minute,
      second: iso.second,
      millisecond: iso.millisecond,
      microsecond: iso.microsecond,
      nanosecond: iso.nanosecond,
    })
  }

  private inCalendar (date: PlainDateTime): PlainDateTime {
    return date.calendarId === this._calendar ? date : date.withCalendar(this._calendar)
  }

  private firstDayOfYear (year: number): PlainDateTime {
    return this.engine.PlainDate.from({ year, month: 1, day: 1, calendar: this._calendar }).toPlainDateTime()
  }

  /**
   * Gets a cached Intl.DateTimeFormat instance or creates one if not cached.
   * Cache is limited to MAX_CACHE_SIZE entries to prevent memory leaks.
   */
  private getFormatter (options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
    const key = `${this.locale}:${JSON.stringify(options)}`
    let formatter = this.formatCache.get(key)

    if (!formatter) {
      // Evict oldest entry if cache is full
      /* v8 ignore next 4 -- cache-eviction only triggers past MAX_CACHE_SIZE; not exercised through public API */
      if (this.formatCache.size >= MAX_CACHE_SIZE) {
        const firstKey = this.formatCache.keys().next().value
        if (firstKey) this.formatCache.delete(firstKey)
      }

      // Without an explicit calendar Intl uses the locale's default, e.g. persian for fa-IR
      const calendar = this._calendar === 'iso8601' ? 'gregory' : this._calendar
      formatter = new Intl.DateTimeFormat(this.locale, { ...options, calendar })
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
      /* v8 ignore next 4 -- cache-eviction only triggers past MAX_CACHE_SIZE; not exercised through public API */
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
