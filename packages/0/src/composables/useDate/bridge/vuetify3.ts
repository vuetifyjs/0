/**
 * @module Vuetify3DateBridge
 *
 * @remarks
 * Bridge adapter that wraps v0's DateAdapter to be compatible with Vuetify 3's
 * internal date composable. This enables Vuetify 3 to use v0's Temporal-based
 * date adapter instead of its native Date-based implementation.
 *
 * @example
 * ```ts
 * // In Vuetify 3 setup
 * import { createVuetify3DateBridge } from '@vuetify/v0'
 * import { V0DateAdapter } from '@vuetify/v0'
 *
 * const vuetify = createVuetify({
 *   date: {
 *     adapter: createVuetify3DateBridge(new V0DateAdapter('en-US')),
 *   },
 * })
 * ```
 */

import type { DateAdapter } from '../adapters/adapter'

/**
 * Vuetify 3's internal date adapter interface.
 * This mirrors what Vuetify 3 expects from its date adapters.
 */
export interface Vuetify3DateAdapter {
  locale: string

  // Vuetify 3 uses string-based dates for external API
  date: (value?: unknown) => unknown
  toJsDate: (value: unknown) => Date
  parseISO: (date: string) => unknown
  toISO: (date: unknown) => string
  isValid: (date: unknown) => boolean

  format: (date: unknown, formatString: string) => string

  startOfDay: (date: unknown) => unknown
  endOfDay: (date: unknown) => unknown
  startOfWeek: (date: unknown) => unknown
  endOfWeek: (date: unknown) => unknown
  startOfMonth: (date: unknown) => unknown
  endOfMonth: (date: unknown) => unknown
  startOfYear: (date: unknown) => unknown
  endOfYear: (date: unknown) => unknown

  addMinutes: (date: unknown, amount: number) => unknown
  addHours: (date: unknown, amount: number) => unknown
  addDays: (date: unknown, amount: number) => unknown
  addWeeks: (date: unknown, amount: number) => unknown
  addMonths: (date: unknown, amount: number) => unknown

  isAfter: (date: unknown, comparing: unknown) => boolean
  isAfterDay: (date: unknown, comparing: unknown) => boolean
  isBefore: (date: unknown, comparing: unknown) => boolean
  isEqual: (date: unknown, comparing: unknown) => boolean
  isSameDay: (date: unknown, comparing: unknown) => boolean
  isSameMonth: (date: unknown, comparing: unknown) => boolean
  isSameYear: (date: unknown, comparing: unknown) => boolean
  isWithinRange: (date: unknown, range: [unknown, unknown]) => boolean

  getYear: (date: unknown) => number
  getMonth: (date: unknown) => number
  getDate: (date: unknown) => number
  getHours: (date: unknown) => number
  getMinutes: (date: unknown) => number
  getDiff: (date: unknown, comparing: unknown, unit?: string) => number
  getWeek: (date: unknown) => number
  getWeekdays: () => string[]
  getWeekArray: (date: unknown) => unknown[][]

  setYear: (date: unknown, year: number) => unknown
  setMonth: (date: unknown, month: number) => unknown
  setDate: (date: unknown, day: number) => unknown
  setHours: (date: unknown, hours: number) => unknown
  setMinutes: (date: unknown, minutes: number) => unknown

  getNextMonth: (date: unknown) => unknown
  getPreviousMonth: (date: unknown) => unknown
}

export interface Vuetify3DateBridgeOptions {
  /** How to represent dates when returning from the bridge */
  outputMode?: 'internal' | 'iso'
  /** First day of week (0=Sunday, 1=Monday, etc.) */
  firstDayOfWeek?: number
}

/**
 * Creates a Vuetify 3 compatible date adapter wrapper around v0's DateAdapter.
 *
 * @param v0Adapter - The v0 DateAdapter instance to wrap
 * @param options - Bridge configuration options
 * @returns A Vuetify 3 compatible adapter
 */
export function createVuetify3DateBridge<T> (
  v0Adapter: DateAdapter<T>,
  options: Vuetify3DateBridgeOptions = {},
): Vuetify3DateAdapter {
  const { outputMode = 'internal', firstDayOfWeek = 0 } = options

  // Helper to convert input to internal format
  function toInternal (value: unknown): T | null {
    if (value == null) return v0Adapter.date()
    return v0Adapter.date(value)
  }

  // Helper to format output based on mode
  function toOutput (value: T): unknown {
    if (outputMode === 'iso') {
      return v0Adapter.toISO(value)
    }
    return value
  }

  return {
    get locale () {
      return v0Adapter.locale ?? 'en-US'
    },

    set locale (value: string) {
      if (v0Adapter.locale !== undefined) {
        v0Adapter.locale = value
      }
    },

    date (value?: unknown) {
      const result = toInternal(value)
      return result ? toOutput(result) : null
    },

    toJsDate (value: unknown) {
      const internal = toInternal(value)
      return internal ? v0Adapter.toJsDate(internal) : new Date(Number.NaN)
    },

    parseISO (date: string) {
      return toOutput(v0Adapter.parseISO(date))
    },

    toISO (date: unknown) {
      const internal = toInternal(date)
      return internal ? v0Adapter.toISO(internal) : ''
    },

    isValid (date: unknown) {
      return v0Adapter.isValid(date)
    },

    format (date: unknown, formatString: string) {
      const internal = toInternal(date)
      return internal ? v0Adapter.format(internal, formatString) : ''
    },

    startOfDay (date: unknown) {
      const internal = toInternal(date)
      return internal ? toOutput(v0Adapter.startOfDay(internal)) : null
    },

    endOfDay (date: unknown) {
      const internal = toInternal(date)
      return internal ? toOutput(v0Adapter.endOfDay(internal)) : null
    },

    startOfWeek (date: unknown) {
      const internal = toInternal(date)
      return internal ? toOutput(v0Adapter.startOfWeek(internal, firstDayOfWeek)) : null
    },

    endOfWeek (date: unknown) {
      const internal = toInternal(date)
      return internal ? toOutput(v0Adapter.endOfWeek(internal)) : null
    },

    startOfMonth (date: unknown) {
      const internal = toInternal(date)
      return internal ? toOutput(v0Adapter.startOfMonth(internal)) : null
    },

    endOfMonth (date: unknown) {
      const internal = toInternal(date)
      return internal ? toOutput(v0Adapter.endOfMonth(internal)) : null
    },

    startOfYear (date: unknown) {
      const internal = toInternal(date)
      return internal ? toOutput(v0Adapter.startOfYear(internal)) : null
    },

    endOfYear (date: unknown) {
      const internal = toInternal(date)
      return internal ? toOutput(v0Adapter.endOfYear(internal)) : null
    },

    addMinutes (date: unknown, amount: number) {
      const internal = toInternal(date)
      return internal ? toOutput(v0Adapter.addMinutes(internal, amount)) : null
    },

    addHours (date: unknown, amount: number) {
      const internal = toInternal(date)
      return internal ? toOutput(v0Adapter.addHours(internal, amount)) : null
    },

    addDays (date: unknown, amount: number) {
      const internal = toInternal(date)
      return internal ? toOutput(v0Adapter.addDays(internal, amount)) : null
    },

    addWeeks (date: unknown, amount: number) {
      const internal = toInternal(date)
      return internal ? toOutput(v0Adapter.addWeeks(internal, amount)) : null
    },

    addMonths (date: unknown, amount: number) {
      const internal = toInternal(date)
      return internal ? toOutput(v0Adapter.addMonths(internal, amount)) : null
    },

    isAfter (date: unknown, comparing: unknown) {
      const a = toInternal(date)
      const b = toInternal(comparing)
      return a && b ? v0Adapter.isAfter(a, b) : false
    },

    isAfterDay (date: unknown, comparing: unknown) {
      const a = toInternal(date)
      const b = toInternal(comparing)
      return a && b ? v0Adapter.isAfterDay(a, b) : false
    },

    isBefore (date: unknown, comparing: unknown) {
      const a = toInternal(date)
      const b = toInternal(comparing)
      return a && b ? v0Adapter.isBefore(a, b) : false
    },

    isEqual (date: unknown, comparing: unknown) {
      const a = toInternal(date)
      const b = toInternal(comparing)
      return a && b ? v0Adapter.isEqual(a, b) : false
    },

    isSameDay (date: unknown, comparing: unknown) {
      const a = toInternal(date)
      const b = toInternal(comparing)
      return a && b ? v0Adapter.isSameDay(a, b) : false
    },

    isSameMonth (date: unknown, comparing: unknown) {
      const a = toInternal(date)
      const b = toInternal(comparing)
      return a && b ? v0Adapter.isSameMonth(a, b) : false
    },

    isSameYear (date: unknown, comparing: unknown) {
      const a = toInternal(date)
      const b = toInternal(comparing)
      return a && b ? v0Adapter.isSameYear(a, b) : false
    },

    isWithinRange (date: unknown, range: [unknown, unknown]) {
      const d = toInternal(date)
      const start = toInternal(range[0])
      const end = toInternal(range[1])
      return d && start && end ? v0Adapter.isWithinRange(d, [start, end]) : false
    },

    getYear (date: unknown) {
      const internal = toInternal(date)
      return internal ? v0Adapter.getYear(internal) : 0
    },

    getMonth (date: unknown) {
      const internal = toInternal(date)
      return internal ? v0Adapter.getMonth(internal) : 0
    },

    getDate (date: unknown) {
      const internal = toInternal(date)
      return internal ? v0Adapter.getDate(internal) : 0
    },

    getHours (date: unknown) {
      const internal = toInternal(date)
      return internal ? v0Adapter.getHours(internal) : 0
    },

    getMinutes (date: unknown) {
      const internal = toInternal(date)
      return internal ? v0Adapter.getMinutes(internal) : 0
    },

    getDiff (date: unknown, comparing: unknown, unit?: string) {
      const a = toInternal(date)
      const b = toInternal(comparing)
      return a && b ? v0Adapter.getDiff(a, b, unit) : 0
    },

    getWeek (date: unknown) {
      const internal = toInternal(date)
      return internal ? v0Adapter.getWeek(internal, firstDayOfWeek) : 0
    },

    getWeekdays () {
      return v0Adapter.getWeekdays(firstDayOfWeek)
    },

    getWeekArray (date: unknown) {
      const internal = toInternal(date)
      if (!internal) return []
      const weeks = v0Adapter.getWeekArray(internal, firstDayOfWeek)
      if (outputMode === 'iso') {
        return weeks.map(week => week.map(d => v0Adapter.toISO(d)))
      }
      return weeks
    },

    setYear (date: unknown, year: number) {
      const internal = toInternal(date)
      return internal ? toOutput(v0Adapter.setYear(internal, year)) : null
    },

    setMonth (date: unknown, month: number) {
      const internal = toInternal(date)
      return internal ? toOutput(v0Adapter.setMonth(internal, month)) : null
    },

    setDate (date: unknown, day: number) {
      const internal = toInternal(date)
      return internal ? toOutput(v0Adapter.setDate(internal, day)) : null
    },

    setHours (date: unknown, hours: number) {
      const internal = toInternal(date)
      return internal ? toOutput(v0Adapter.setHours(internal, hours)) : null
    },

    setMinutes (date: unknown, minutes: number) {
      const internal = toInternal(date)
      return internal ? toOutput(v0Adapter.setMinutes(internal, minutes)) : null
    },

    getNextMonth (date: unknown) {
      const internal = toInternal(date)
      return internal ? toOutput(v0Adapter.getNextMonth(internal)) : null
    },

    getPreviousMonth (date: unknown) {
      const internal = toInternal(date)
      return internal ? toOutput(v0Adapter.getPreviousMonth(internal)) : null
    },
  }
}
