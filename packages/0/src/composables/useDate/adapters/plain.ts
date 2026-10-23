/**
 * @module PlainDateAdapter
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-date
 *
 * @remarks
 * `DateAdapter` backed by a JavaScript `Date`. Date-only ISO strings are local
 * calendar days (`new Date(year, monthIndex, day)`), not UTC midnight.
 * Month and year arithmetic clamps the day, so January 31 plus one month is
 * the last day of February. This adapter does not load Temporal.
 *
 * @example
 * ```ts
 * import { PlainDateAdapter } from '@vuetify/v0'
 *
 * const adapter = new PlainDateAdapter('en-US')
 * adapter.toISO(adapter.parseISO('2026-02-01')) // '2026-02-01'
 * ```
 */

// Globals
import { IN_BROWSER } from '#v0/constants/globals'

// Adapters
import { DateAdapter } from './adapter'

// Utilities
import { isNaN, isNull, isNullOrUndefined, isNumber, isString, V0Error } from '#v0/utilities'

// Week info
import { deriveWeekInfo } from '../weekinfo'

const FORMAT_TOKEN_REGEX = /YYYY|YY|MMMM|MMM|MM|M|dddd|ddd|DD|D|HH|H|hh|h|mm|m|ss|s|A|a/g

const MAX_CACHE_SIZE = 50

const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/

const OFFSET = /(?:Z|[+-]\d{2}:\d{2})$/

const NAIVE = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?)?$/

export class PlainDateAdapter extends DateAdapter<Date> {
  private _locale: string
  private _firstDayOfWeek = 0
  private _minimalDays = 1
  private formatCache = new Map<string, Intl.DateTimeFormat>()
  private numberFormatCache = new Map<string, Intl.NumberFormat>()

  constructor (locale = 'en-US') {
    super()
    this._locale = locale
    const info = deriveWeekInfo(locale)
    this._firstDayOfWeek = info.firstDay
    this._minimalDays = info.minimalDays
  }

  get locale (): string {
    return this._locale
  }

  get firstDayOfWeek (): number {
    return this._firstDayOfWeek
  }

  set locale (value: string) {
    if (this._locale === value) return

    this._locale = value
    const info = deriveWeekInfo(value)
    this._firstDayOfWeek = info.firstDay
    this._minimalDays = info.minimalDays
    this.formatCache.clear()
    this.numberFormatCache.clear()
  }

  set firstDayOfWeek (value: number) {
    this._firstDayOfWeek = value
  }

  /**
   * @remarks
   * No argument: the current time in the browser, or local `1970-01-01`
   * on the server. A `Date` is copied. A `YYYY-MM-DD` string is that
   * local calendar day.
   */
  date (value?: unknown): Date | null {
    if (isNullOrUndefined(value)) {
      return IN_BROWSER ? new Date() : new Date(1970, 0, 1)
    }

    if (value instanceof Date) {
      return isNaN(value.getTime()) ? null : new Date(value)
    }

    if (isString(value)) {
      try {
        return this.parseISO(value)
      } catch {
        return null
      }
    }

    if (isNumber(value)) {
      const date = new Date(value)

      return isNaN(date.getTime()) ? null : date
    }

    return null
  }

  toJsDate (value: Date): Date {
    return new Date(value)
  }

  parseISO (dateString: string): Date {
    const only = DATE_ONLY.exec(dateString)

    if (only) {
      return this.civil(Number(only[1]), Number(only[2]), Number(only[3]))
    }

    if (OFFSET.test(dateString)) {
      const parsed = new Date(dateString)

      if (isNaN(parsed.getTime())) this.invalid(dateString)

      return this.stamp(
        parsed.getFullYear(),
        parsed.getMonth(),
        parsed.getDate(),
        parsed.getHours(),
        parsed.getMinutes(),
        parsed.getSeconds(),
        parsed.getMilliseconds(),
      )
    }

    const naive = NAIVE.exec(dateString)

    if (naive) {
      const date = this.civil(Number(naive[1]), Number(naive[2]), Number(naive[3]))
      const fraction = naive[7]
      const milliseconds = fraction ? Number(fraction.padEnd(3, '0').slice(0, 3)) : 0

      return this.stamp(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        Number(naive[4] ?? 0),
        Number(naive[5] ?? 0),
        Number(naive[6] ?? 0),
        milliseconds,
      )
    }

    return this.invalid(dateString)
  }

  /** `YYYY-MM-DD` from local calendar fields. Time is dropped. */
  toISO (date: Date): string {
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${String(date.getFullYear())}-${month}-${day}`
  }

  /** `format` is ignored. Parsing goes through `date()`. */
  parse (value: string, _format: string): Date | null {
    return this.date(value)
  }

  isValid (date: unknown): date is Date {
    if (date instanceof Date) return !isNaN(date.getTime())

    if (isString(date)) {
      try {
        this.parseISO(date)

        return true
      } catch {
        return false
      }
    }

    return false
  }

  isNullish (value: Date | null): value is null {
    return isNullOrUndefined(value)
  }

  getCurrentLocaleCode (): string {
    return this.locale
  }

  is12HourCycleInCurrentLocale (): boolean {
    const formatOptions = new Intl.DateTimeFormat(this.locale, { hour: 'numeric' }).resolvedOptions()

    return formatOptions.hour12 ?? false
  }

  format (date: Date, formatString: string): string {
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

    if (options) return this.getFormatter(options).format(date)

    return this.getFormatter({}).format(date)
  }

  formatByString (date: Date, formatString: string): string {
    const getTokenValue = (token: string): string => {
      const hours = date.getHours()

      switch (token) {
        case 'YYYY': { return String(date.getFullYear()) }
        case 'YY': { return String(date.getFullYear()).slice(-2) }
        case 'MM': { return String(date.getMonth() + 1).padStart(2, '0') }
        case 'M': { return String(date.getMonth() + 1) }
        case 'DD': { return String(date.getDate()).padStart(2, '0') }
        case 'D': { return String(date.getDate()) }
        case 'HH': { return String(hours).padStart(2, '0') }
        case 'H': { return String(hours) }
        case 'hh': { return String(hours % 12 || 12).padStart(2, '0') }
        case 'h': { return String(hours % 12 || 12) }
        case 'mm': { return String(date.getMinutes()).padStart(2, '0') }
        case 'm': { return String(date.getMinutes()) }
        case 'ss': { return String(date.getSeconds()).padStart(2, '0') }
        case 's': { return String(date.getSeconds()) }
        case 'A': { return hours < 12 ? 'AM' : 'PM' }
        case 'a': { return hours < 12 ? 'am' : 'pm' }
        case 'MMMM': { return this.getFormatter({ month: 'long' }).format(date) }
        case 'MMM': { return this.getFormatter({ month: 'short' }).format(date) }
        case 'dddd': { return this.getFormatter({ weekday: 'long' }).format(date) }
        case 'ddd': { return this.getFormatter({ weekday: 'short' }).format(date) }
        default: { return token }
      }
    }

    return formatString.replace(FORMAT_TOKEN_REGEX, match => getTokenValue(match))
  }

  getFormatHelperText (format: string): string {
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
    const match = formatted.match(/[ap]m|午前|午後|上午|下午/i)

    return match ? match[0] : ampm.toUpperCase()
  }

  startOfDay (date: Date): Date {
    return this.stamp(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0)
  }

  endOfDay (date: Date): Date {
    return this.stamp(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999)
  }

  startOfWeek (date: Date): Date {
    const diff = (date.getDay() - this.firstDayOfWeek + 7) % 7

    return this.startOfDay(this.addDays(date, -diff))
  }

  endOfWeek (date: Date): Date {
    return this.endOfDay(this.addDays(this.startOfWeek(date), 6))
  }

  startOfMonth (date: Date): Date {
    return this.stamp(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0)
  }

  endOfMonth (date: Date): Date {
    return this.endOfDay(this.stamp(date.getFullYear(), date.getMonth() + 1, 0, 0, 0, 0, 0))
  }

  startOfYear (date: Date): Date {
    return this.stamp(date.getFullYear(), 0, 1, 0, 0, 0, 0)
  }

  endOfYear (date: Date): Date {
    return this.stamp(date.getFullYear(), 11, 31, 23, 59, 59, 999)
  }

  addSeconds (date: Date, amount: number): Date {
    return this.stamp(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds() + amount,
      date.getMilliseconds(),
    )
  }

  addMinutes (date: Date, amount: number): Date {
    return this.stamp(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes() + amount,
      date.getSeconds(),
      date.getMilliseconds(),
    )
  }

  addHours (date: Date, amount: number): Date {
    return this.stamp(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours() + amount,
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds(),
    )
  }

  /**
   * Calendar days, not elapsed milliseconds. A DST transition does not
   * drop or repeat a date.
   */
  addDays (date: Date, amount: number): Date {
    const utc = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate() + amount))

    return this.stamp(
      utc.getUTCFullYear(),
      utc.getUTCMonth(),
      utc.getUTCDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds(),
    )
  }

  addWeeks (date: Date, amount: number): Date {
    return this.addDays(date, amount * 7)
  }

  /** Clamps the day to the target month. January 31 plus one month is February 28 or 29. */
  addMonths (date: Date, amount: number): Date {
    const probe = new Date(date.getFullYear(), date.getMonth() + amount, 1)
    const dim = new Date(probe.getFullYear(), probe.getMonth() + 1, 0).getDate()

    return this.stamp(
      probe.getFullYear(),
      probe.getMonth(),
      Math.min(date.getDate(), dim),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds(),
    )
  }

  addYears (date: Date, amount: number): Date {
    return this.addMonths(date, amount * 12)
  }

  isAfter (date: Date, comparing: Date): boolean {
    return date.getTime() > comparing.getTime()
  }

  isAfterDay (date: Date, comparing: Date): boolean {
    return this.toISO(date) > this.toISO(comparing)
  }

  isAfterMonth (date: Date, comparing: Date): boolean {
    if (date.getFullYear() !== comparing.getFullYear()) return date.getFullYear() > comparing.getFullYear()

    return date.getMonth() > comparing.getMonth()
  }

  isAfterYear (date: Date, comparing: Date): boolean {
    return date.getFullYear() > comparing.getFullYear()
  }

  isBefore (date: Date, comparing: Date): boolean {
    return date.getTime() < comparing.getTime()
  }

  isBeforeDay (date: Date, comparing: Date): boolean {
    return this.toISO(date) < this.toISO(comparing)
  }

  isBeforeMonth (date: Date, comparing: Date): boolean {
    if (date.getFullYear() !== comparing.getFullYear()) return date.getFullYear() < comparing.getFullYear()

    return date.getMonth() < comparing.getMonth()
  }

  isBeforeYear (date: Date, comparing: Date): boolean {
    return date.getFullYear() < comparing.getFullYear()
  }

  isEqual (date: Date, comparing: Date): boolean {
    return date.getTime() === comparing.getTime()
  }

  isSameDay (date: Date, comparing: Date): boolean {
    return this.toISO(date) === this.toISO(comparing)
  }

  isSameMonth (date: Date, comparing: Date): boolean {
    return date.getFullYear() === comparing.getFullYear() && date.getMonth() === comparing.getMonth()
  }

  isSameYear (date: Date, comparing: Date): boolean {
    return date.getFullYear() === comparing.getFullYear()
  }

  isSameHour (date: Date, comparing: Date): boolean {
    return this.isSameDay(date, comparing) && date.getHours() === comparing.getHours()
  }

  isWithinRange (date: Date, [start, end]: [Date, Date]): boolean {
    return date.getTime() >= start.getTime() && date.getTime() <= end.getTime()
  }

  getYear (date: Date): number {
    return date.getFullYear()
  }

  /** 0-indexed, matching `Date#getMonth`. */
  getMonth (date: Date): number {
    return date.getMonth()
  }

  getDate (date: Date): number {
    return date.getDate()
  }

  getHours (date: Date): number {
    return date.getHours()
  }

  getMinutes (date: Date): number {
    return date.getMinutes()
  }

  getSeconds (date: Date): number {
    return date.getSeconds()
  }

  getDiff (date: Date, comparing: Date | string, unit?: string): number {
    const comp = isString(comparing) ? this.date(comparing) : comparing

    if (isNull(comp)) return 0

    const unitKey = unit ?? 'days'
    const days = this.dayNumber(date) - this.dayNumber(comp)

    switch (unitKey) {
      case 'years': { return date.getFullYear() - comp.getFullYear() }
      case 'months': { return (date.getFullYear() - comp.getFullYear()) * 12 + (date.getMonth() - comp.getMonth()) }
      case 'weeks': { return Math.trunc(days / 7) }
      case 'hours': { return Math.trunc((date.getTime() - comp.getTime()) / 3_600_000) }
      case 'minutes': { return Math.trunc((date.getTime() - comp.getTime()) / 60_000) }
      case 'seconds': { return Math.trunc((date.getTime() - comp.getTime()) / 1000) }
      default: { return days }
    }
  }

  getWeek (date: Date, minimalDays?: number): number {
    const md = minimalDays ?? this._minimalDays
    const currentWeekStart = this.startOfWeek(date)
    const currentWeekEnd = this.addDays(currentWeekStart, 6)

    let year = this.getYear(currentWeekStart)

    if (year < this.getYear(currentWeekEnd)) {
      const nextYearStart = new Date(year + 1, 0, 1)
      const nextYearFirstWeekSize = 7 - this.getDiff(nextYearStart, this.startOfWeek(nextYearStart), 'days')

      if (nextYearFirstWeekSize >= md) year++
    }

    const yearStart = new Date(year, 0, 1)
    const firstWeekSize = 7 - this.getDiff(yearStart, this.startOfWeek(yearStart), 'days')
    const weekOneStart = firstWeekSize >= md
      ? this.addWeeks(this.addDays(yearStart, firstWeekSize), -1)
      : this.addDays(yearStart, firstWeekSize)

    return 1 + this.getDiff(currentWeekStart, weekOneStart, 'weeks')
  }

  getDaysInMonth (date: Date): number {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  setYear (date: Date, year: number): Date {
    return this.addYears(date, year - date.getFullYear())
  }

  /** `month` is 0-indexed. The day clamps to that month. */
  setMonth (date: Date, month: number): Date {
    const probe = new Date(date.getFullYear(), month, 1)
    const dim = new Date(probe.getFullYear(), probe.getMonth() + 1, 0).getDate()

    return this.stamp(
      probe.getFullYear(),
      probe.getMonth(),
      Math.min(date.getDate(), dim),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds(),
    )
  }

  setDate (date: Date, day: number): Date {
    return this.stamp(date.getFullYear(), date.getMonth(), day, date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds())
  }

  setHours (date: Date, hours: number): Date {
    return this.stamp(date.getFullYear(), date.getMonth(), date.getDate(), hours, date.getMinutes(), date.getSeconds(), date.getMilliseconds())
  }

  setMinutes (date: Date, minutes: number): Date {
    return this.stamp(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), minutes, date.getSeconds(), date.getMilliseconds())
  }

  setSeconds (date: Date, seconds: number): Date {
    return this.stamp(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), seconds, date.getMilliseconds())
  }

  getWeekdays (format: 'long' | 'short' | 'narrow' = 'narrow'): string[] {
    const weekdays: string[] = []
    const formatter = this.getFormatter({ weekday: format })

    for (let i = 0; i < 7; i++) {
      const day = new Date(2015, 0, 4 + ((i + this.firstDayOfWeek) % 7))

      weekdays.push(formatter.format(day))
    }

    return weekdays
  }

  getWeekArray (date: Date, fixedWeeks = false): Date[][] {
    const weeks: Date[][] = []
    let current = this.startOfWeek(this.startOfMonth(date))
    const end = this.endOfWeek(this.endOfMonth(date))

    while (weeks.length < 6) {
      if (this.isAfter(current, end) && !fixedWeeks) break

      const week: Date[] = []

      for (let i = 0; i < 7; i++) {
        week.push(current)
        current = this.addDays(current, 1)
      }

      weeks.push(week)
    }

    return weeks
  }

  getMonthArray (date: Date): Date[] {
    const months: Date[] = []

    for (let month = 0; month < 12; month++) {
      months.push(new Date(date.getFullYear(), month, 1))
    }

    return months
  }

  getYearRange (start: Date, end: Date): Date[] {
    const years: Date[] = []

    for (let year = start.getFullYear(); year <= end.getFullYear(); year++) {
      years.push(new Date(year, 0, 1))
    }

    return years
  }

  getNextMonth (date: Date): Date {
    return this.startOfMonth(this.addMonths(date, 1))
  }

  getPreviousMonth (date: Date): Date {
    return this.startOfMonth(this.addMonths(date, -1))
  }

  mergeDateAndTime (date: Date, time: Date): Date {
    return this.stamp(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      time.getHours(),
      time.getMinutes(),
      time.getSeconds(),
      time.getMilliseconds(),
    )
  }

  private invalid (value: string): never {
    throw new V0Error('Invalid date', {
      code: 'V0_DATE_INVALID',
      value,
    })
  }

  /** Local calendar day. Rejects a day the month does not contain. */
  private civil (year: number, month: number, day: number): Date {
    const date = new Date(year, month - 1, day)

    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
      const monthText = String(month).padStart(2, '0')
      const dayText = String(day).padStart(2, '0')

      this.invalid(`${year}-${monthText}-${dayText}`)
    }

    return date
  }

  private stamp (
    year: number,
    month: number,
    day: number,
    hours: number,
    minutes: number,
    seconds: number,
    milliseconds: number,
  ): Date {
    return new Date(year, month, day, hours, minutes, seconds, milliseconds)
  }

  /** UTC day index, so a DST shift cannot change a day diff. */
  private dayNumber (date: Date): number {
    return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000)
  }

  private getFormatter (options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
    const key = `${this.locale}:${JSON.stringify(options)}`
    let formatter = this.formatCache.get(key)

    if (!formatter) {
      /* v8 ignore next 4 -- cache-eviction only triggers past MAX_CACHE_SIZE; not exercised through public API */
      if (this.formatCache.size >= MAX_CACHE_SIZE) {
        const firstKey = this.formatCache.keys().next().value

        if (firstKey) this.formatCache.delete(firstKey)
      }

      formatter = new Intl.DateTimeFormat(this.locale, options)
      this.formatCache.set(key, formatter)
    }

    return formatter
  }

  private getNumberFormatter (): Intl.NumberFormat {
    let formatter = this.numberFormatCache.get(this.locale)

    if (!formatter) {
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
