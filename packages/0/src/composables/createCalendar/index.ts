/**
 * @module createCalendar
 *
 * @see https://0.vuetifyjs.com/composables/forms/create-calendar
 *
 * @remarks
 * Geometry and navigation for a month calendar. Provides the minimum any
 * calendar needs — a navigable month matrix with focus management — without
 * imposing selection semantics. Selection lives a layer up: this core has no
 * `selected`, no `select()`, and no notion of a chosen value.
 *
 * Key features:
 * - Visible-month anchor kept separate from the focused date, the two
 *   mutually correcting: paging snaps focus in-month, walking focus out of the
 *   visible month pages the anchor
 * - `min` / `max` walls that clamp paging and gray cells
 * - Month matrix shaped as `CalendarMonth[]` from day one, so multi-month
 *   ranges never break the consumer contract
 * - `now` refreshed on a midnight tick, so `today` rolls over on a page left open
 * - Works with plain `Date` by default; integrates with `createDatePlugin`
 *   when installed for locale-aware formatting and adapter-backed arithmetic
 *
 * @example
 * ```ts
 * const calendar = createCalendar({ min: '2026-01-01', fixedWeeks: true })
 *
 * calendar.next()
 * calendar.move('day', 1)
 * ```
 */

// Composables
import { useTimer } from '#v0/composables/useTimer'

// Globals
import { IN_BROWSER } from '#v0/constants/globals'

import { useCalendarDate } from './date'

// Utilities
import { clamp, isFunction, isString, isUndefined } from '#v0/utilities'
import { computed, shallowRef, toRef, toValue, watch } from 'vue'

// Types
import type { CalendarWeekday } from './date'
import type { ComputedRef, MaybeRefOrGetter, Ref } from 'vue'

// Exports
export type { CalendarWeekday } from './date'

/** Axes `move()` walks the focused date along. */
export type CalendarUnit = 'day' | 'week' | 'month' | 'year'

/**
 * Represents a single day cell in the calendar grid.
 *
 * @example
 * ```ts
 * const calendar = createCalendar()
 * const cells = calendar.months.value[0].weeks.flat()
 *
 * cells.forEach(cell => {
 *   if (cell.today) console.log('Today:', cell.iso)
 *   if (cell.disabled) console.log('Disabled:', cell.iso)
 * })
 * ```
 */
export interface CalendarCell {
  /** `YYYY-MM-DD` — identity, key, and model currency. */
  iso: string
  day: number
  /** Per-day predicate ∪ `min`/`max` ∪ whole-calendar `disabled`. */
  disabled: boolean
  today: boolean
  /** Outside the anchor month — the leading and trailing spill. */
  outside: boolean
}

/**
 * Represents a single month in the calendar.
 *
 * @example
 * ```ts
 * const calendar = createCalendar()
 * const month = calendar.months.value[0]
 *
 * console.log('Anchor:', month.anchor) // 'YYYY-MM'
 * month.weeks.forEach(week => {
 *   week.forEach(cell => console.log(cell.iso))
 * })
 * ```
 */
export interface CalendarMonth {
  /** `YYYY-MM`. */
  anchor: string
  weeks: CalendarCell[][]
}

/**
 * Options for createCalendar.
 *
 * @example
 * ```ts
 * const calendar = createCalendar({
 *   month: () => anchor.value,
 *   min: '2026-01-01',
 *   max: '2026-12-31',
 *   fixedWeeks: true,
 * })
 * ```
 */
export interface CalendarOptions {
  /**
   * `YYYY-MM` anchor. Uncontrolled default: the current month.
   *
   * @example
   * ```ts
   * createCalendar({ month: '2026-08' })
   * createCalendar({ month: () => selectedMonth.value })
   * ```
   */
  month?: MaybeRefOrGetter<string>
  /**
   * Minimum selectable date in `YYYY-MM-DD` format.
   *
   * @example
   * ```ts
   * createCalendar({ min: '2026-01-01' })
   * ```
   */
  min?: string
  /**
   * Maximum selectable date in `YYYY-MM-DD` format.
   *
   * @example
   * ```ts
   * createCalendar({ max: '2026-12-31' })
   * ```
   */
  max?: string
  /**
   * Whole-calendar flag or a per-day predicate. Both arrive as functions at
   * runtime, so the value is called with the day either way — a zero-argument
   * getter simply ignores it.
   *
   * @example
   * ```ts
   * // Disable entire calendar
   * createCalendar({ disabled: true })
   *
   * // Disable weekends
   * createCalendar({
   *   disabled: iso => {
   *     const [y, m, d] = iso.split('-').map(Number)
   *     const day = new Date(y, m - 1, d).getDay()
   *     return day === 0 || day === 6
   *   }
   * })
   * ```
   */
  disabled?: MaybeRefOrGetter<boolean> | ((iso: string) => boolean)
  /**
   * First day of week override. 0=Sun, 1=Mon, ... 6=Sat.
   * Defaults to the date engine's locale-derived value.
   *
   * @example
   * ```ts
   * createCalendar({ firstDayOfWeek: 1 }) // Start weeks on Monday
   * ```
   */
  firstDayOfWeek?: MaybeRefOrGetter<number>
  /**
   * Pad the matrix to a constant six rows.
   *
   * @default false
   *
   * @example
   * ```ts
   * createCalendar({ fixedWeeks: true })
   * ```
   */
  fixedWeeks?: boolean
  /**
   * Locale for formatting when no date plugin is installed.
   * Defaults to 'en-US'.
   *
   * @example
   * ```ts
   * createCalendar({ locale: 'de-DE' })
   * ```
   */
  locale?: string
}

/**
 * Context returned by createCalendar.
 *
 * @example
 * ```ts
 * const calendar = createCalendar()
 *
 * // Navigate
 * calendar.next()
 * calendar.prev()
 * calendar.goto('2026-08-15')
 *
 * // Move focus
 * calendar.move('day', 1)
 * calendar.move('week', -1)
 *
 * // Read state
 * console.log(calendar.anchor.value)
 * console.log(calendar.focused.value)
 * console.log(calendar.label.value)
 * ```
 */
export interface CalendarContext {
  /** Length 1 today; shape-stable for multi-month ranges. */
  months: ComputedRef<CalendarMonth[]>
  /** Weekday labels in the configured rotation. */
  weekdays: ComputedRef<CalendarWeekday[]>
  /** Localized "August 2026". */
  label: ComputedRef<string>
  /** `YYYY-MM` of the visible month. */
  anchor: Readonly<Ref<string>>
  /** `YYYY-MM-DD` the roving tabindex follows. */
  focused: Ref<string>
  /** At the `min` wall. */
  isFirst: Readonly<Ref<boolean>>
  /** At the `max` wall. */
  isLast: Readonly<Ref<boolean>>
  /**
   * Page to the `min` month; no-op when unbounded.
   *
   * @example
   * ```ts
   * calendar.first()
   * ```
   */
  first: () => void
  /**
   * Page to the `max` month; no-op when unbounded.
   *
   * @example
   * ```ts
   * calendar.last()
   * ```
   */
  last: () => void
  /**
   * Page to the next month.
   *
   * @example
   * ```ts
   * calendar.next()
   * ```
   */
  next: () => void
  /**
   * Page to the previous month.
   *
   * @example
   * ```ts
   * calendar.prev()
   * ```
   */
  prev: () => void
  /**
   * Page by whole months, clamped to the walls.
   *
   * @param count Number of months to step (positive forward, negative backward).
   *
   * @example
   * ```ts
   * calendar.step(3)  // Forward 3 months
   * calendar.step(-6) // Backward 6 months
   * ```
   */
  step: (count: number) => void
  /**
   * Accepts `YYYY-MM` or `YYYY-MM-DD`; pages and focuses.
   *
   * @param value Target date string.
   *
   * @example
   * ```ts
   * calendar.goto('2026-08')     // Go to month, focus entry day
   * calendar.goto('2026-08-15')  // Go to month, focus specific day
   * ```
   */
  goto: (value: string) => void
  /**
   * Page to the current month and focus today. Selects nothing.
   *
   * @example
   * ```ts
   * calendar.today()
   * ```
   */
  today: () => void
  /**
   * Walk the focused date, paging the anchor when it leaves the visible month.
   *
   * @param unit The axis to walk along.
   * @param amount Number of units to move (positive forward, negative backward).
   *
   * @example
   * ```ts
   * calendar.move('day', 1)    // Next day
   * calendar.move('week', -1)  // Previous week
   * calendar.move('month', 1)  // Same day next month
   * calendar.move('year', -1)  // Same day previous year
   * ```
   */
  move: (unit: CalendarUnit, amount: number) => void
}

/** Months since year zero — the total order the walls clamp against. */
function ordinal (anchor: string) {
  const [year, month] = anchor.split('-').map(Number)

  return year * 12 + month - 1
}

function key (value: number) {
  const year = Math.floor(value / 12)

  return `${String(year).padStart(4, '0')}-${String(value - year * 12 + 1).padStart(2, '0')}`
}

function within (iso: string, anchor: string) {
  return iso.startsWith(anchor)
}

/**
 * `YYYY-MM` or `YYYY-MM-DD`. A structural check, not validation — it exists so
 * an unparseable string no-ops instead of turning the anchor into `NaN`.
 */
const SHAPE = /^\d{4}-\d{2}(?:-\d{2})?$/

function shaped (value: unknown): value is string {
  return isString(value) && SHAPE.test(value)
}

/**
 * Creates the geometry and navigation state for a month calendar.
 *
 * @param options Bounds, anchor, and matrix shape.
 * @returns The calendar context.
 *
 * @see https://0.vuetifyjs.com/composables/forms/create-calendar
 *
 * @example
 * ```ts
 * const calendar = createCalendar({ month: () => anchor.value })
 *
 * calendar.goto('2026-08-04')
 * calendar.months.value[0].weeks
 * ```
 *
 * @example
 * ```ts
 * // With bounds
 * const bounded = createCalendar({
 *   min: '2026-01-01',
 *   max: '2026-12-31',
 *   fixedWeeks: true,
 * })
 *
 * // Navigate
 * bounded.next()
 * bounded.prev()
 * bounded.move('day', 1)
 *
 * // Read state
 * console.log(bounded.anchor.value)    // '2026-01'
 * console.log(bounded.focused.value)   // '2026-01-01'
 * console.log(bounded.isFirst.value)   // true
 * ```
 *
 * @example
 * ```ts
 * // Disable specific days
 * const noWeekends = createCalendar({
 *   disabled: iso => {
 *     const [y, m, d] = iso.split('-').map(Number)
 *     const day = new Date(y, m - 1, d).getDay()
 *     return day === 0 || day === 6
 *   }
 * })
 * ```
 */
export function createCalendar (options: CalendarOptions = {}): CalendarContext {
  const { month, min, max, disabled, firstDayOfWeek, fixedWeeks = false, locale = 'en-US' } = options

  const date = useCalendarDate(locale)

  const floor = shaped(min) ? ordinal(min.slice(0, 7)) : Number.NEGATIVE_INFINITY
  const ceiling = shaped(max) ? ordinal(max.slice(0, 7)) : Number.POSITIVE_INFINITY

  /** Today, re-read on a midnight tick rather than snapshotted at setup. */
  const now = shallowRef(date.iso(date.now()))

  const timer = useTimer(() => {
    now.value = date.iso(date.now())
  }, { duration: () => date.midnight(), repeat: true })

  if (IN_BROWSER) timer.start()

  function wall (value: string) {
    return key(clamp(ordinal(value), floor, ceiling))
  }

  const opening = toValue(month)

  const anchor = shallowRef(wall(shaped(opening) ? opening.slice(0, 7) : now.value.slice(0, 7)))

  /** Focus never rests on a walled-off day. */
  function bound (iso: string) {
    if (shaped(min) && iso < min) return min
    if (shaped(max) && iso > max) return max

    return iso
  }

  /** The day to land on when the anchor moves: today when visible, else the 1st. */
  function entry (value: string) {
    return bound(within(now.value, value) ? now.value : `${value}-01`)
  }

  const focused = shallowRef(entry(anchor.value))

  /**
   * Lands the focused day in `value`, keeping its day of month — `date.months`
   * already clamps that to the target's length (Jan 31 → Feb 28) — then pulling
   * it inside the walls. Falls back to the entry rule when the carried day
   * cannot live there at all.
   */
  function carry (value: string) {
    const delta = ordinal(value) - ordinal(focused.value.slice(0, 7))
    const shifted = date.iso(date.months(date.parse(focused.value), delta))

    return within(shifted, value) ? bound(shifted) : entry(value)
  }

  /**
   * The anchor and the focused date correct each other, so focus is settled
   * *before* the anchor moves — that leaves nothing for the invariant watcher
   * below to re-snap, which is what keeps an internal page from snapping twice.
   */
  function goto (value: string) {
    if (!shaped(value)) return

    const target = wall(value.slice(0, 7))

    focused.value = value.length > 7 && within(value, target) ? bound(value) : entry(target)
    anchor.value = target
  }

  function step (count: number) {
    const target = wall(key(ordinal(anchor.value) + count))

    focused.value = carry(target)
    anchor.value = target
  }

  /**
   * Whoever moves the anchor — a controlled `month` source, or a consumer
   * writing through the model — is paging, so focus follows rather than
   * stranding on a day the visible grid no longer renders.
   */
  watch(anchor, value => {
    if (within(focused.value, value)) return

    focused.value = carry(value)
  }, { flush: 'sync' })

  function move (unit: CalendarUnit, amount: number) {
    const from = date.parse(focused.value)
    let to: Date

    switch (unit) {
      case 'month': {
        to = date.months(from, amount)
        break
      }
      case 'year': {
        to = date.years(from, amount)
        break
      }
      case 'week': {
        to = date.days(from, amount * 7)
        break
      }
      default: {
        to = date.days(from, amount)
      }
    }

    const iso = date.iso(to)

    if (shaped(min) && iso < min) return goto(min)
    if (shaped(max) && iso > max) return goto(max)

    focused.value = iso

    const target = iso.slice(0, 7)

    if (target !== anchor.value) anchor.value = target
  }

  if (!isUndefined(month)) {
    watch(() => toValue(month), value => {
      if (!shaped(value)) return

      anchor.value = wall(value.slice(0, 7))
    })
  }

  function blocked (iso: string) {
    if (isFunction(disabled)) return (disabled as (iso: string) => boolean)(iso)

    return toValue(disabled) === true
  }

  function walled (iso: string) {
    return (shaped(min) && iso < min) || (shaped(max) && iso > max)
  }

  const start = toRef(() => toValue(firstDayOfWeek) ?? date.first())

  const weekdays = computed(() => date.weekdays(start.value))

  const months = computed((): CalendarMonth[] => {
    const value = anchor.value
    const cursor = date.parse(value)
    const today = now.value

    const weeks = date.weeks(cursor, start.value, fixedWeeks).map(week => week.map(
      (day): CalendarCell => {
        const iso = date.iso(day)

        return {
          iso,
          day: day.getDate(),
          disabled: walled(iso) || blocked(iso),
          today: iso === today,
          outside: !within(iso, value),
        }
      },
    ))

    return [{ anchor: value, weeks }]
  })

  const label = computed(() => date.label(date.parse(anchor.value)))

  return {
    months,
    weekdays,
    label,
    anchor,
    focused,
    isFirst: toRef(() => ordinal(anchor.value) <= floor),
    isLast: toRef(() => ordinal(anchor.value) >= ceiling),
    first: () => {
      if (shaped(min)) goto(min.slice(0, 7))
    },
    last: () => {
      if (shaped(max)) goto(max.slice(0, 7))
    },
    next: () => step(1),
    prev: () => step(-1),
    step,
    goto,
    today: () => goto(now.value),
    move,
  }
}
