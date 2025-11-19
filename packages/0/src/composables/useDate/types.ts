/**
 * Type definitions for the date composable system
 */

import type { Temporal } from '@js-temporal/polyfill'

/**
 * Options for initializing a date adapter
 */
export interface DateAdapterOptions {
  /**
   * Locale for formatting dates (e.g., 'en-US', 'fr-FR')
   * @default 'en-US'
   */
  locale?: string

  /**
   * Custom format strings for predefined formats
   */
  formats?: Record<string, Intl.DateTimeFormatOptions>

  /**
   * First day of the week (0 = Sunday, 1 = Monday, etc.)
   * @default 0
   */
  firstDayOfWeek?: number

  /**
   * First day of year that is always in week 1
   * @default 1
   */
  firstDayOfYear?: number
}

/**
 * Generic date adapter interface
 * @template T The internal date type used by the adapter
 */
export interface DateAdapter<T = unknown> {
  /**
   * Locale used by this adapter
   */
  locale?: string

  /**
   * Parse a value into a date object
   * @param value - Value to parse (string, Date, Temporal.PlainDate, etc.)
   * @returns Parsed date or null if invalid
   */
  date(value?: unknown): T | null

  /**
   * Convert adapter's date type to JavaScript Date
   * @param date - Date to convert
   * @returns JavaScript Date object
   */
  toJsDate(date: T): Date

  /**
   * Convert date to ISO 8601 string
   * @param date - Date to convert
   * @returns ISO string (e.g., '2023-11-30')
   */
  toISO(date: T): string

  /**
   * Parse ISO 8601 string to date
   * @param isoString - ISO string to parse
   * @returns Parsed date
   */
  parseISO(isoString: string): T

  // Arithmetic operations
  addMinutes(date: T, amount: number): T
  addHours(date: T, amount: number): T
  addDays(date: T, amount: number): T
  addWeeks(date: T, amount: number): T
  addMonths(date: T, amount: number): T

  // Date boundaries
  startOfDay(date: T): T
  endOfDay(date: T): T
  startOfWeek(date: T, firstDayOfWeek?: number): T
  endOfWeek(date: T, firstDayOfWeek?: number): T
  startOfMonth(date: T): T
  endOfMonth(date: T): T
  startOfYear(date: T): T
  endOfYear(date: T): T

  // Comparison
  isEqual(date: T, comparing: T): boolean
  isAfter(date: T, comparing: T): boolean
  isBefore(date: T, comparing: T): boolean
  isAfterDay(date: T, comparing: T): boolean
  isSameDay(date: T, comparing: T): boolean
  isSameMonth(date: T, comparing: T): boolean
  isSameYear(date: T, comparing: T): boolean
  isValid(date: unknown): boolean
  isWithinRange(date: T, range: [T, T]): boolean

  // Getters
  getYear(date: T): number
  getMonth(date: T): number
  getDate(date: T): number
  getHours(date: T): number
  getMinutes(date: T): number
  getWeek(date: T, firstDayOfWeek?: number, firstDayOfYear?: number): number
  getWeekdays(firstDayOfWeek?: number, weekdayFormat?: 'long' | 'short' | 'narrow'): string[]
  getNextMonth(date: T): T
  getPreviousMonth(date: T): T

  // Setters
  setYear(date: T, year: number): T
  setMonth(date: T, month: number): T
  setDate(date: T, day: number): T
  setHours(date: T, hours: number): T
  setMinutes(date: T, minutes: number): T

  // Utilities
  format(date: T, formatString: string): string
  getDiff(date: T, comparing: T | string, unit?: 'days' | 'months' | 'years' | 'hours' | 'minutes'): number
  getWeekArray(date: T, firstDayOfWeek?: number): T[][]
}

/**
 * Context options for creating a date composable
 */
export interface DateOptions<T = unknown> extends DateAdapterOptions {
  /**
   * Namespace for dependency injection
   * @default 'v0:date'
   */
  namespace?: string

  /**
   * Date adapter instance or constructor
   */
  adapter?: DateAdapter<T> | (new (options: DateAdapterOptions) => DateAdapter<T>)
}

/**
 * Context type returned by useDate
 */
export interface DateContext<T = unknown> extends DateAdapter<T> {
  /**
   * Current locale
   */
  locale: string

  /**
   * Update adapter options
   */
  setLocale(locale: string): void
}
