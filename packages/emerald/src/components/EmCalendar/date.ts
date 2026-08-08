/**
 * Adapter-shaped date engine for the calendar family.
 *
 * v1 runs on plain `Date`. When an app installs `createDatePlugin`, the same
 * seam delegates to that adapter instead — resolved by optional injection, so
 * the plugin is a bonus and never a requirement.
 */

// Framework
import { isNull, useContext } from '@vuetify/v0'

// Types
import type { DateContext } from '@vuetify/v0'

export interface EmCalendarWeekday {
  long: string
  short: string
}

export interface EmCalendarDate {
  /** Locale/adapter default; the root's `firstDayOfWeek` prop overrides it. */
  first: () => number
  now: () => Date
  iso: (value: Date) => string
  /** First of the month `value` falls in. */
  month: (value: Date) => Date
  days: (value: Date, amount: number) => Date
  months: (value: Date, amount: number) => Date
  same: (value: Date, comparing: Date) => boolean
  /** "August 2026" */
  label: (value: Date) => string
  /** "Tuesday, August 4, 2026" */
  full: (value: Date) => string
  weekdays: (first: number) => EmCalendarWeekday[]
}

function pad (value: number) {
  return String(value).padStart(2, '0')
}

/** Local parts, not `toISOString()` — UTC lands on the previous day west of Greenwich. */
function iso (value: Date) {
  return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}`
}

function month (value: Date) {
  return new Date(value.getFullYear(), value.getMonth(), 1)
}

function days (value: Date, amount: number) {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate() + amount)
}

function months (value: Date, amount: number) {
  const target = new Date(value.getFullYear(), value.getMonth() + amount, 1)
  // Day 0 of the next month is the last day of the target one — clamps Jan 31 → Feb 28.
  const last = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate()

  target.setDate(Math.min(value.getDate(), last))

  return target
}

function same (value: Date, comparing: Date) {
  return iso(value) === iso(comparing)
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
    }
  })
}

const plain: EmCalendarDate = {
  first: () => 0,
  now: () => new Date(),
  iso,
  month,
  days,
  months,
  same,
  label,
  full,
  weekdays,
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

  return {
    first: () => context.firstDayOfWeek.value,
    now: () => new Date(),
    iso,
    month: value => convert(value, input => adapter.startOfMonth(input), month(value)),
    days: (value, amount) => convert(value, input => adapter.addDays(input, amount), days(value, amount)),
    months: (value, amount) => convert(value, input => adapter.addMonths(input, amount), months(value, amount)),
    same: (value, comparing) => {
      const left = adapter.date(value)
      const right = adapter.date(comparing)

      if (adapter.isNullish(left) || adapter.isNullish(right)) return same(value, comparing)

      return adapter.isSameDay(left, right)
    },
    label: value => text(value, 'monthAndYear', label(value)),
    full: value => text(value, 'fullDateWithWeekday', full(value)),
    weekdays,
  }
}

/**
 * Optional injection: `useDate()` throws without `createDatePlugin`, so the
 * context is read directly with a `null` default instead.
 */
export function useEmCalendarDate (): EmCalendarDate {
  const context = useContext<DateContext<unknown> | null>('v0:date', null)

  return isNull(context) ? plain : adapted(context)
}
