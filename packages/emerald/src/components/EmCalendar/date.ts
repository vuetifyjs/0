/**
 * Adapter-shaped date engine for the calendar family.
 *
 * v1 runs on plain `Date`. When an app installs `createDatePlugin`, the same
 * seam delegates to that adapter instead — resolved by optional injection, so
 * the plugin is a bonus and never a requirement.
 */

// Framework
import { isNull, useContext } from '@vuetify/v0'

// Utilities
import { hasInjectionContext } from 'vue'

// Types
import type { DateContext } from '@vuetify/v0'

export interface EmCalendarWeekday {
  long: string
  short: string
  narrow: string
}

export interface EmCalendarDate {
  /** Locale/adapter default; the root's `firstDayOfWeek` prop overrides it. */
  first: () => number
  now: () => Date
  iso: (value: Date) => string
  /** `YYYY-MM-DD` or `YYYY-MM` back to a local `Date`. */
  parse: (value: string) => Date
  /** First of the month `value` falls in. */
  month: (value: Date) => Date
  days: (value: Date, amount: number) => Date
  months: (value: Date, amount: number) => Date
  years: (value: Date, amount: number) => Date
  same: (value: Date, comparing: Date) => boolean
  /** "August 2026" */
  label: (value: Date) => string
  /** "Tuesday, August 4, 2026" */
  full: (value: Date) => string
  weekdays: (first: number) => EmCalendarWeekday[]
  /** Month matrix in weeks of 7, padded to six rows when `fixed`. */
  weeks: (value: Date, first: number, fixed: boolean) => Date[][]
  /** Milliseconds until the next local midnight. */
  midnight: () => number
}

function pad (value: number) {
  return String(value).padStart(2, '0')
}

/** Local parts, not `toISOString()` — UTC lands on the previous day west of Greenwich. */
function iso (value: Date) {
  return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}`
}

/**
 * Every `Date` in this module is built from parts here, because the two-digit
 * year constructor folds 0-99 into the 1900s. Shifting after the fact keeps any
 * month/day rollover the constructor already resolved.
 */
function build (year: number, index: number, day: number) {
  const result = new Date(year, index, day)

  if (year >= 0 && year <= 99) result.setFullYear(result.getFullYear() - 1900)

  return result
}

/** Local parts, never `new Date(iso)` — that reads `YYYY-MM-DD` as UTC midnight. */
function parse (value: string) {
  const [year, index, day] = value.split('-').map(Number)

  return build(year, index - 1, day ?? 1)
}

function month (value: Date) {
  return build(value.getFullYear(), value.getMonth(), 1)
}

function days (value: Date, amount: number) {
  return build(value.getFullYear(), value.getMonth(), value.getDate() + amount)
}

function months (value: Date, amount: number) {
  const target = build(value.getFullYear(), value.getMonth() + amount, 1)
  // Day 0 of the next month is the last day of the target one — clamps Jan 31 → Feb 28.
  const last = build(target.getFullYear(), target.getMonth() + 1, 0).getDate()

  target.setDate(Math.min(value.getDate(), last))

  return target
}

function years (value: Date, amount: number) {
  return months(value, amount * 12)
}

function same (value: Date, comparing: Date) {
  return iso(value) === iso(comparing)
}

/** `days()` builds at local midnight, so the delta is the time left in the day. */
function midnight () {
  const value = new Date()

  return days(value, 1).getTime() - value.getTime()
}

function label (value: Date) {
  return value.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
}

function full (value: Date) {
  return value.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function weekdays (first: number): EmCalendarWeekday[] {
  // 2024-01-07 was a Sunday, so offset 0 anchors the week at index 0 = Sunday.
  const anchor = new Date(2024, 0, 7)

  return Array.from({ length: 7 }, (_, index) => {
    const day = days(anchor, (first + index) % 7)

    return {
      long: day.toLocaleDateString(undefined, { weekday: 'long' }),
      short: day.toLocaleDateString(undefined, { weekday: 'short' }),
      narrow: day.toLocaleDateString(undefined, { weekday: 'narrow' }),
    }
  })
}

function matrix (start: Date, rows: number): Date[][] {
  return Array.from({ length: rows }, (_, week) => Array.from(
    { length: 7 },
    (_, day) => days(start, week * 7 + day),
  ))
}

/** Continues day by day rather than repeating a week, so the spill stays real dates. */
function fill (rows: Date[][], fixed: boolean): Date[][] {
  const last = rows.at(-1)?.at(-1)

  if (!fixed || rows.length >= 6 || !last) return rows

  return [...rows, ...matrix(days(last, 1), 6 - rows.length)]
}

function weeks (value: Date, first: number, fixed: boolean): Date[][] {
  const anchor = month(value)
  const lead = (anchor.getDay() - first + 7) % 7
  // Day 0 of the next month is the last day of this one.
  const length = build(anchor.getFullYear(), anchor.getMonth() + 1, 0).getDate()

  return matrix(days(anchor, -lead), fixed ? 6 : Math.ceil((lead + length) / 7))
}

const plain: EmCalendarDate = {
  first: () => 0,
  now: () => new Date(),
  iso,
  parse,
  month,
  days,
  months,
  years,
  same,
  label,
  full,
  weekdays,
  weeks,
  midnight,
}

/** Same seam, backed by an installed `DateAdapter`. Falls back per call if it rejects a date. */
function adapted (context: DateContext<unknown>): EmCalendarDate {
  const { adapter } = context

  function convert (value: Date, run: (input: unknown) => unknown, fallback: Date) {
    const input = adapter.date(value)

    return adapter.isNullish(input) ? fallback : adapter.toJsDate(run(input))
  }

  function text (value: Date, format: string, fallback: string) {
    const input = adapter.date(value)

    return adapter.isNullish(input) ? fallback : adapter.format(input, format)
  }

  /**
   * `getWeekArray` and `getWeekdays` both rotate by the adapter's *own*
   * `firstDayOfWeek`; when the root's prop overrides it, only the plain walk
   * honours the override.
   */
  function rotates (first: number) {
    return first === context.firstDayOfWeek.value
  }

  return {
    first: () => context.firstDayOfWeek.value,
    now: () => new Date(),
    iso,
    parse,
    month: value => convert(value, input => adapter.startOfMonth(input), month(value)),
    days: (value, amount) => convert(value, input => adapter.addDays(input, amount), days(value, amount)),
    months: (value, amount) => convert(value, input => adapter.addMonths(input, amount), months(value, amount)),
    years: (value, amount) => convert(value, input => adapter.addYears(input, amount), years(value, amount)),
    same: (value, comparing) => {
      const left = adapter.date(value)
      const right = adapter.date(comparing)

      if (adapter.isNullish(left) || adapter.isNullish(right)) return same(value, comparing)

      return adapter.isSameDay(left, right)
    },
    label: value => text(value, 'monthAndYear', label(value)),
    full: value => text(value, 'fullDateWithWeekday', full(value)),
    weekdays: first => {
      if (!rotates(first)) return weekdays(first)

      const [long, short, narrow] = (['long', 'short', 'narrow'] as const)
        .map(format => adapter.getWeekdays(format))

      return Array.from({ length: 7 }, (_, index) => ({
        long: long[index],
        short: short[index],
        narrow: narrow[index],
      }))
    },
    weeks: (value, first, fixed) => {
      if (!rotates(first)) return weeks(value, first, fixed)

      const input = adapter.date(value)

      if (adapter.isNullish(input)) return weeks(value, first, fixed)

      // graduation: v0's adapter now takes `getWeekArray(date, fixedWeeks)`
      // (PR #797) — drop the local `fill` once the core rides that branch.
      return fill(
        adapter.getWeekArray(input).map(week => week.map(day => adapter.toJsDate(day))),
        fixed,
      )
    },
    midnight,
  }
}

/**
 * Optional injection: `useDate()` throws without `createDatePlugin`, so the
 * context is read directly with a `null` default instead. Outside an injection
 * context — SSR helpers, unit tests — the plain engine answers without Vue
 * warning about a stray `inject`.
 */
export function useEmCalendarDate (): EmCalendarDate {
  if (!hasInjectionContext()) return plain

  const context = useContext<DateContext<unknown> | null>('v0:date', null)

  return isNull(context) ? plain : adapted(context)
}
