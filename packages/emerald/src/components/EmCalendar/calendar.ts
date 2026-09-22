/**
 * @module createCalendar
 *
 * @remarks
 * Geometry and navigation for a month calendar — the minimum any calendar
 * needs, and deliberately nothing more. Selection lives a layer up: this core
 * has no `selected`, no `select()`, and no notion of a chosen value.
 *
 * Incubating inside Emerald ahead of graduation to `packages/0` as
 * `createCalendar`; the `@see` docs link lands with that move. It is not
 * exported from any Emerald barrel — the DS consumes it as a private core.
 *
 * Key features:
 * - Visible-month anchor kept separate from the focused date, the two
 *   mutually correcting: paging snaps focus in-month, walking focus out of the
 *   visible month pages the anchor
 * - `min` / `max` walls that clamp paging and gray cells
 * - Month matrix shaped as `CalendarMonth[]` from day one, so multi-month
 *   ranges never break the consumer contract
 * - `now` refreshed on a midnight tick, so `today` rolls over on a page left open
 *
 * @example
 * ```ts
 * const calendar = createCalendar({ min: '2026-01-01', fixedWeeks: true })
 *
 * calendar.next()
 * calendar.move('day', 1)
 * ```
 */

// Framework
import { clamp, IN_BROWSER, isFunction, isString, isUndefined, useTimer } from '@vuetify/v0'

// Composables
import { useEmCalendarDate } from './date'

// Utilities
import { computed, shallowRef, toRef, toValue, watch } from 'vue'

// Types
import type { EmCalendarWeekday } from './date'
import type { ComputedRef, MaybeRefOrGetter, Ref } from 'vue'

/** Axes `move()` walks the focused date along. */
export type CalendarUnit = 'day' | 'week' | 'month' | 'year'

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

export interface CalendarMonth {
  /** `YYYY-MM`. */
  anchor: string
  weeks: CalendarCell[][]
}

export interface CalendarOptions {
  /** `YYYY-MM` anchor. Uncontrolled default: the current month. */
  month?: MaybeRefOrGetter<string>
  /** `YYYY-MM-DD`. */
  min?: string
  /** `YYYY-MM-DD`. */
  max?: string
  /**
   * Whole-calendar flag or a per-day predicate. Both arrive as functions at
   * runtime, so the value is called with the day either way — a zero-argument
   * getter simply ignores it.
   */
  disabled?: MaybeRefOrGetter<boolean> | ((iso: string) => boolean)
  /** Defaults to the date engine's locale-derived value. */
  firstDayOfWeek?: MaybeRefOrGetter<number>
  /** Pad the matrix to a constant six rows. */
  fixedWeeks?: boolean
}

export interface CalendarContext {
  /** Length 1 today; shape-stable for multi-month ranges. */
  months: ComputedRef<CalendarMonth[]>
  weekdays: ComputedRef<EmCalendarWeekday[]>
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
  /** Page to the `min` month; no-op when unbounded. */
  first: () => void
  /** Page to the `max` month; no-op when unbounded. */
  last: () => void
  next: () => void
  prev: () => void
  /** Page by whole months, clamped to the walls. */
  step: (count: number) => void
  /** Accepts `YYYY-MM` or `YYYY-MM-DD`; pages and focuses. */
  goto: (value: string) => void
  /** Page to the current month and focus today. Selects nothing. */
  today: () => void
  /** Walk the focused date, paging the anchor when it leaves the visible month. */
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
const SHAPE = /^\d{4}-\d{2}(-\d{2})?$/

function shaped (value: unknown): value is string {
  return isString(value) && SHAPE.test(value)
}

/**
 * Creates the geometry and navigation state for a month calendar.
 *
 * @param options Bounds, anchor, and matrix shape.
 * @returns The calendar context.
 *
 * @example
 * ```ts
 * const calendar = createCalendar({ month: () => anchor.value })
 *
 * calendar.goto('2026-08-04')
 * calendar.months.value[0].weeks
 * ```
 */
export function createCalendar (options: CalendarOptions = {}): CalendarContext {
  const { month, min, max, disabled, firstDayOfWeek, fixedWeeks = false } = options

  const date = useEmCalendarDate()

  const floor = shaped(min) ? ordinal(min.slice(0, 7)) : Number.NEGATIVE_INFINITY
  const ceiling = shaped(max) ? ordinal(max.slice(0, 7)) : Number.POSITIVE_INFINITY

  /** Today, re-read on a midnight tick rather than snapshotted at setup. */
  const now = shallowRef(date.iso(date.now()))

  // `repeat` re-resolves the duration after each fire, so every cycle measures
  // afresh to the next local midnight — DST-safe, and `isActive` stays true.
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

    // A walk that overshoots a wall lands on it rather than stopping dead.
    if (shaped(min) && iso < min) return goto(min)
    if (shaped(max) && iso > max) return goto(max)

    focused.value = iso

    const target = iso.slice(0, 7)

    if (target !== anchor.value) anchor.value = target
  }

  if (!isUndefined(month)) {
    watch(() => toValue(month), value => {
      if (!shaped(value)) return

      // Only the anchor moves; the watcher above carries focus across with it.
      anchor.value = wall(value.slice(0, 7))
    })
  }

  function blocked (iso: string) {
    // Getter and predicate are indistinguishable at runtime; a getter ignores
    // the argument and answers for the whole calendar.
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
