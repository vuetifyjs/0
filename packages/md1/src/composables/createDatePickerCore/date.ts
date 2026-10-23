/**
 * Locale-aware formatting for the date picker core.
 *
 * Plain `Intl` on the browser's locale by default. When the app installs
 * `createDatePlugin`, the same seam reads that context instead: its adapter
 * formats the month label, the cell names, the year and the weekday initials,
 * and its locale drives the header date, a pattern no adapter preset covers.
 * Resolved by optional injection because `useDate()` throws without the
 * plugin, and the picker must render without it (SPEC.md, Md1DatePicker).
 */

// Framework
import { isNull, useContext } from '@vuetify/v0'

// Utilities
import { hasInjectionContext } from 'vue'

// Types
import type { DateContext } from '@vuetify/v0'

export interface DatePickerWeekday {
  /** "Thursday": the column header's accessible name. */
  long: string
  /** "T": the initial the grid prints. */
  narrow: string
}

export interface DatePickerEngine {
  /** The locale's first weekday when a date plugin is installed, else 0 (Sunday). */
  first: () => number
  /** "April 2017" */
  month: (value: Date) => string
  /** "Thu, Apr 13" */
  heading: (value: Date) => string
  /** "Thursday, April 13, 2017" */
  full: (value: Date) => string
  /** "2017" */
  year: (value: Date) => string
  /** The seven weekday names starting from `first`. */
  weekdays: (first: number) => DatePickerWeekday[]
}

/** 2024-01-07 was a Sunday, so offset 0 anchors the week at Sunday. */
const SUNDAY = new Date(2024, 0, 7)

const HEADING: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' }
const MONTH: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric' }
const FULL: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
const YEAR: Intl.DateTimeFormatOptions = { year: 'numeric' }

const formatters = new Map<string, Intl.DateTimeFormat>()

/** One formatter per locale and option set: the grid names 30 cells per render. */
function formatter (locale: string | undefined, options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  const key = `${locale ?? ''}|${JSON.stringify(options)}`
  let result = formatters.get(key)

  if (!result) {
    result = new Intl.DateTimeFormat(locale, options)
    formatters.set(key, result)
  }

  return result
}

function weekday (locale: string | undefined, first: number, index: number, format: 'long' | 'narrow'): string {
  const day = new Date(SUNDAY.getFullYear(), SUNDAY.getMonth(), SUNDAY.getDate() + ((first + index) % 7))

  return formatter(locale, { weekday: format }).format(day)
}

function plain (locale?: string): DatePickerEngine {
  return {
    first: () => 0,
    month: value => formatter(locale, MONTH).format(value),
    heading: value => formatter(locale, HEADING).format(value),
    full: value => formatter(locale, FULL).format(value),
    year: value => formatter(locale, YEAR).format(value),
    weekdays: first => Array.from({ length: 7 }, (_, index) => ({
      long: weekday(locale, first, index, 'long'),
      narrow: weekday(locale, first, index, 'narrow'),
    })),
  }
}

/** The same seam over an installed `DateAdapter`; a date the adapter rejects falls back to `Intl` per call. */
function adapted (context: DateContext<unknown>): DatePickerEngine {
  const { adapter } = context

  function fallback () {
    return plain(context.locale.value)
  }

  function text (value: Date, format: string, otherwise: (value: Date) => string): string {
    const input = adapter.date(value)

    return adapter.isNullish(input) ? otherwise(value) : adapter.format(input, format)
  }

  return {
    first: () => context.firstDayOfWeek.value,
    month: value => text(value, 'monthAndYear', fallback().month),
    // No adapter preset renders weekday, month and day without the year.
    heading: value => fallback().heading(value),
    full: value => text(value, 'fullDateWithWeekday', fallback().full),
    year: value => text(value, 'year', fallback().year),
    weekdays: first => {
      // The adapter rotates its own list by its first weekday; re-rotate it to the one asked for.
      const offset = (first - context.firstDayOfWeek.value + 7) % 7
      const long = adapter.getWeekdays('long')
      const narrow = adapter.getWeekdays('narrow')

      return Array.from({ length: 7 }, (_, index) => ({
        long: long[(index + offset) % 7] ?? '',
        narrow: narrow[(index + offset) % 7] ?? '',
      }))
    },
  }
}

/**
 * Resolves the formatting engine: the installed date plugin when there is one,
 * plain `Intl` otherwise. Outside an injection context (unit tests, SSR
 * helpers) the plain engine answers without Vue warning about a stray `inject`.
 */
export function useDatePickerEngine (): DatePickerEngine {
  if (!hasInjectionContext()) return plain()

  const context = useContext<DateContext<unknown> | null>('v0:date', null)

  return isNull(context) ? plain() : adapted(context)
}
