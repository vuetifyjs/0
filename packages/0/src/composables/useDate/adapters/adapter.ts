/**
 * @module DateAdapter
 *
 * @remarks
 * Abstract base class for date adapters that provide date manipulation, comparison, and formatting.
 * The default implementation uses the Temporal API for modern, immutable date handling.
 *
 * This interface is designed to be compatible with date-io's IUtils interface,
 * which is the industry standard for date library abstraction.
 *
 * @see https://github.com/dmtrKovalenko/date-io
 */

// Types
import type { Temporal } from '@js-temporal/polyfill'

export abstract class DateAdapter<T = Temporal.PlainDateTime> {
  /** Current locale for formatting */
  abstract get locale (): string
  /** First day of week. 0=Sunday, 1=Monday, ... 6=Saturday. Managed by the plugin. */
  abstract get firstDayOfWeek (): number
  abstract set locale (value: string)
  abstract set firstDayOfWeek (value: number)

  // ============================================
  // Construction & Conversion
  // ============================================

  /** Create a date from various input types */
  abstract date (value?: unknown): T | null
  /** Convert to JavaScript Date object */
  abstract toJsDate (value: T): Date
  /** Parse ISO 8601 string */
  abstract parseISO (date: string): T
  /** Convert to ISO 8601 string */
  abstract toISO (date: T): string
  /** Parse date string with custom format */
  abstract parse (value: string, format: string): T | null
  /** Check if value is a valid date (type predicate for narrowing) */
  abstract isValid (date: unknown): date is T
  /** Check if value is null (type predicate for narrowing) */
  abstract isNullish (value: T | null): value is null

  // ============================================
  // Locale & Formatting
  // ============================================

  /** Get current locale code */
  abstract getCurrentLocaleCode (): string
  /** Check if current locale uses 12-hour cycle */
  abstract is12HourCycleInCurrentLocale (): boolean
  /** Format date using preset format key */
  abstract format (date: T, formatString: string): string
  /** Format date using custom format string */
  abstract formatByString (date: T, formatString: string): string
  /** Get helper text for format string (e.g., "mm/dd/yyyy") */
  abstract getFormatHelperText (format: string): string
  /** Format number according to locale */
  abstract formatNumber (numberToFormat: string): string
  /** Get meridiem text (AM/PM) for locale */
  abstract getMeridiemText (ampm: 'am' | 'pm'): string

  // ============================================
  // Navigation - Start/End boundaries
  // ============================================

  abstract startOfDay (date: T): T
  abstract endOfDay (date: T): T
  abstract startOfWeek (date: T): T
  abstract endOfWeek (date: T): T
  abstract startOfMonth (date: T): T
  abstract endOfMonth (date: T): T
  abstract startOfYear (date: T): T
  abstract endOfYear (date: T): T

  // ============================================
  // Arithmetic
  // ============================================

  abstract addSeconds (date: T, amount: number): T
  abstract addMinutes (date: T, amount: number): T
  abstract addHours (date: T, amount: number): T
  abstract addDays (date: T, amount: number): T
  abstract addWeeks (date: T, amount: number): T
  abstract addMonths (date: T, amount: number): T
  abstract addYears (date: T, amount: number): T

  // ============================================
  // Comparison
  // ============================================

  abstract isAfter (date: T, comparing: T): boolean
  abstract isAfterDay (date: T, comparing: T): boolean
  abstract isAfterMonth (date: T, comparing: T): boolean
  abstract isAfterYear (date: T, comparing: T): boolean
  abstract isBefore (date: T, comparing: T): boolean
  abstract isBeforeDay (date: T, comparing: T): boolean
  abstract isBeforeMonth (date: T, comparing: T): boolean
  abstract isBeforeYear (date: T, comparing: T): boolean
  abstract isEqual (date: T, comparing: T): boolean
  abstract isSameDay (date: T, comparing: T): boolean
  abstract isSameMonth (date: T, comparing: T): boolean
  abstract isSameYear (date: T, comparing: T): boolean
  abstract isSameHour (date: T, comparing: T): boolean
  abstract isWithinRange (date: T, range: [T, T]): boolean

  // ============================================
  // Getters
  // ============================================

  abstract getYear (date: T): number
  abstract getMonth (date: T): number
  abstract getDate (date: T): number
  abstract getHours (date: T): number
  abstract getMinutes (date: T): number
  abstract getSeconds (date: T): number
  /** @param comparing - Can be T or ISO string */
  abstract getDiff (date: T, comparing: T | string, unit?: string): number
  /** @param minimalDays - Minimum days in first week for it to count as week 1 */
  abstract getWeek (date: T, minimalDays?: number): number
  /** Get number of days in the month */
  abstract getDaysInMonth (date: T): number

  // ============================================
  // Setters (return new instance - immutable)
  // ============================================

  abstract setYear (date: T, year: number): T
  abstract setMonth (date: T, month: number): T
  abstract setDate (date: T, day: number): T
  abstract setHours (date: T, hours: number): T
  abstract setMinutes (date: T, minutes: number): T
  abstract setSeconds (date: T, seconds: number): T

  // ============================================
  // Calendar Utilities
  // ============================================

  abstract getWeekdays (weekdayFormat?: 'long' | 'short' | 'narrow'): string[]
  abstract getWeekArray (date: T): T[][]
  /** Get array of months in a year (12 dates, one for each month) */
  abstract getMonthArray (date: T): T[]
  /** Get array of years between start and end dates */
  abstract getYearRange (start: T, end: T): T[]

  // ============================================
  // Month Navigation
  // ============================================

  abstract getNextMonth (date: T): T
  abstract getPreviousMonth (date: T): T

  // ============================================
  // Utility
  // ============================================

  /** Merge date from one value with time from another */
  abstract mergeDateAndTime (date: T, time: T): T
}
