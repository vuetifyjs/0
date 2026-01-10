/**
 * @module DateAdapter
 *
 * @remarks
 * Interface for date adapters that provide date manipulation, comparison, and formatting.
 * The default implementation uses the Temporal API for modern, immutable date handling.
 *
 * This interface is designed to be compatible with date-io's IUtils interface,
 * which is the industry standard for date library abstraction.
 *
 * @see https://github.com/dmtrKovalenko/date-io
 */

// Types
import type { Temporal } from '@js-temporal/polyfill'

export interface DateAdapter<T = Temporal.PlainDateTime> {
  /** Current locale for formatting */
  locale?: string

  // ============================================
  // Construction & Conversion
  // ============================================

  /** Create a date from various input types */
  date: (value?: unknown) => T | null
  /** Convert to JavaScript Date object */
  toJsDate: (value: T) => Date
  /** Parse ISO 8601 string */
  parseISO: (date: string) => T
  /** Convert to ISO 8601 string */
  toISO: (date: T) => string
  /** Parse date string with custom format */
  parse: (value: string, format: string) => T | null
  /** Check if value is a valid date (type predicate for narrowing) */
  isValid: (date: unknown) => date is T
  /** Check if value is null (type predicate for narrowing) */
  isNull: (value: T | null) => value is null

  // ============================================
  // Locale & Formatting
  // ============================================

  /** Get current locale code */
  getCurrentLocaleCode: () => string
  /** Check if current locale uses 12-hour cycle */
  is12HourCycleInCurrentLocale: () => boolean
  /** Format date using preset format key */
  format: (date: T, formatString: string) => string
  /** Format date using custom format string */
  formatByString: (date: T, formatString: string) => string
  /** Get helper text for format string (e.g., "mm/dd/yyyy") */
  getFormatHelperText: (format: string) => string
  /** Format number according to locale */
  formatNumber: (numberToFormat: string) => string
  /** Get meridiem text (AM/PM) for locale */
  getMeridiemText: (ampm: 'am' | 'pm') => string

  // ============================================
  // Navigation - Start/End boundaries
  // ============================================

  startOfDay: (date: T) => T
  endOfDay: (date: T) => T
  /** @param firstDayOfWeek - 0=Sunday, 1=Monday, etc. */
  startOfWeek: (date: T, firstDayOfWeek?: number) => T
  /** @param firstDayOfWeek - 0=Sunday, 1=Monday, etc. */
  endOfWeek: (date: T, firstDayOfWeek?: number) => T
  startOfMonth: (date: T) => T
  endOfMonth: (date: T) => T
  startOfYear: (date: T) => T
  endOfYear: (date: T) => T

  // ============================================
  // Arithmetic
  // ============================================

  addSeconds: (date: T, amount: number) => T
  addMinutes: (date: T, amount: number) => T
  addHours: (date: T, amount: number) => T
  addDays: (date: T, amount: number) => T
  addWeeks: (date: T, amount: number) => T
  addMonths: (date: T, amount: number) => T
  addYears: (date: T, amount: number) => T

  // ============================================
  // Comparison
  // ============================================

  isAfter: (date: T, comparing: T) => boolean
  isAfterDay: (date: T, comparing: T) => boolean
  isAfterMonth: (date: T, comparing: T) => boolean
  isAfterYear: (date: T, comparing: T) => boolean
  isBefore: (date: T, comparing: T) => boolean
  isBeforeDay: (date: T, comparing: T) => boolean
  isBeforeMonth: (date: T, comparing: T) => boolean
  isBeforeYear: (date: T, comparing: T) => boolean
  isEqual: (date: T, comparing: T) => boolean
  isSameDay: (date: T, comparing: T) => boolean
  isSameMonth: (date: T, comparing: T) => boolean
  isSameYear: (date: T, comparing: T) => boolean
  isSameHour: (date: T, comparing: T) => boolean
  isWithinRange: (date: T, range: [T, T]) => boolean

  // ============================================
  // Getters
  // ============================================

  getYear: (date: T) => number
  getMonth: (date: T) => number
  getDate: (date: T) => number
  getHours: (date: T) => number
  getMinutes: (date: T) => number
  getSeconds: (date: T) => number
  /** @param comparing - Can be T or ISO string */
  getDiff: (date: T, comparing: T | string, unit?: string) => number
  /** @param minimalDays - Minimum days in first week for it to count as week 1 */
  getWeek: (date: T, firstDayOfWeek?: number, minimalDays?: number) => number
  /** Get number of days in the month */
  getDaysInMonth: (date: T) => number

  // ============================================
  // Setters (return new instance - immutable)
  // ============================================

  setYear: (date: T, year: number) => T
  setMonth: (date: T, month: number) => T
  setDate: (date: T, day: number) => T
  setHours: (date: T, hours: number) => T
  setMinutes: (date: T, minutes: number) => T
  setSeconds: (date: T, seconds: number) => T

  // ============================================
  // Calendar Utilities
  // ============================================

  getWeekdays: (firstDayOfWeek?: number, weekdayFormat?: 'long' | 'short' | 'narrow') => string[]
  getWeekArray: (date: T, firstDayOfWeek?: number) => T[][]
  /** Get array of months in a year (12 dates, one for each month) */
  getMonthArray: (date: T) => T[]
  /** Get array of years between start and end dates */
  getYearRange: (start: T, end: T) => T[]

  // ============================================
  // Month Navigation
  // ============================================

  getNextMonth: (date: T) => T
  getPreviousMonth: (date: T) => T

  // ============================================
  // Utility
  // ============================================

  /** Merge date from one value with time from another */
  mergeDateAndTime: (date: T, time: T) => T
}
