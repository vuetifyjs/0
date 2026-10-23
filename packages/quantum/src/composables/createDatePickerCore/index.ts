/**
 * @module createDatePickerCore
 *
 * @see https://0.vuetifyjs.com/systems/quantum/date-picker
 *
 * @remarks
 * Headless state for the Material Design 1 date picker: the visible month,
 * the focused day the roving tabindex follows, the six-row matrix, the year
 * view and the selection write. v0's `createDatePicker` is a draft with no
 * source, so Quantum owns this core until it graduates (SPEC.md, Deviations).
 * The approach is Emerald's `createCalendar`, cut to the pickers page: no
 * bounds, no disabled days, no ranges, because the page has none. The
 * composable never touches the DOM; `QuDatePicker` binds the events.
 *
 * Key features:
 * - ISO `YYYY-MM-DD` as the single currency: the model, the cell ids and the
 *   focused day compare by value, so a re-created `Date` never breaks identity
 * - The anchor (visible month) and the focused day correct each other: paging
 *   carries focus into the new month on the same day of month, and walking
 *   focus out of the month pages the anchor
 * - A year view that keeps the day of month, clamped to the target month
 *   (February 29 lands on February 28)
 * - `today` rolls over on a midnight tick, so a picker left open stays right
 * - Formatting through the installed date plugin, or `Intl` without one
 *
 * @example
 * ```ts
 * import { createDatePickerCore } from '@paper/quantum'
 *
 * const value = shallowRef<string | undefined>('2017-04-13')
 * const picker = createDatePickerCore({ value })
 *
 * picker.next()
 * picker.move('week', 1)
 * picker.select(picker.focused.value)
 * ```
 */

// Framework
import { clamp, IN_BROWSER, isNumber, isString, range, useTimer } from '@vuetify/v0'

// Composables
import { useDatePickerEngine } from './date'

// Utilities
import { computed, shallowRef, toRef, toValue, watch } from 'vue'

// Types
import type { DatePickerWeekday } from './date'
import type { MaybeRefOrGetter, Ref } from 'vue'

export type { DatePickerWeekday } from './date'

/** The two views the header switches between. */
export type DatePickerView = 'date' | 'year'

/** Axes `move()` walks the focused day along. */
export type DatePickerUnit = 'day' | 'week' | 'month' | 'year'

export interface DatePickerCell {
  /** `YYYY-MM-DD`: identity, key and model currency. */
  iso: string
  day: number
  today: boolean
  /** Outside the visible month: the leading and trailing spill the grid leaves blank. */
  outside: boolean
}

export interface DatePickerYear {
  year: number
  /** The year as the locale prints it. */
  label: string
}

export interface DatePickerCoreOptions {
  /** The selected day, `YYYY-MM-DD`; `select` and `setYear` write it. */
  value: Ref<string | undefined>
  /** 0 is Sunday. Defaults to the installed date plugin's locale value, or Sunday. */
  firstDayOfWeek?: MaybeRefOrGetter<number | undefined>
  /** Years listed on each side of the current year in the year view. @default 100 */
  span?: number
}

export interface DatePickerCoreContext {
  /** `YYYY-MM` of the visible month. */
  anchor: Readonly<Ref<string>>
  /** `YYYY-MM-DD` the roving tabindex follows. */
  focused: Readonly<Ref<string>>
  view: Readonly<Ref<DatePickerView>>
  /** Today as `YYYY-MM-DD`, refreshed at midnight. */
  today: Readonly<Ref<string>>
  /** The day the header shows: the selection, or the focused day while nothing is selected. */
  current: Readonly<Ref<string>>
  /** The header date, "Thu, Apr 13". */
  heading: Readonly<Ref<string>>
  /** The header year. */
  year: Readonly<Ref<number>>
  /** The header year as the locale prints it. */
  yearLabel: Readonly<Ref<string>>
  /** The month navigation label, "April 2017". */
  label: Readonly<Ref<string>>
  /** Six weeks of seven cells, the spill included so the surface never reflows. */
  weeks: Readonly<Ref<DatePickerCell[][]>>
  weekdays: Readonly<Ref<DatePickerWeekday[]>>
  /** The year view's list, centred on the current year. */
  years: Readonly<Ref<DatePickerYear[]>>
  /** The accessible name of a day, "Thursday, April 13, 2017". */
  name: (iso: string) => string
  isSelected: (iso: string) => boolean
  /** Writes the model and focuses the day. */
  select: (iso: string) => void
  /** Focuses a day, paging the anchor to its month when it is not visible. */
  focus: (iso: string) => void
  /** The day `move` would land on, without moving: lets a grid tell an in-month step from one that pages. */
  peek: (unit: DatePickerUnit, amount: number) => string
  /** Walks the focused day, paging the anchor when it leaves the visible month. */
  move: (unit: DatePickerUnit, amount: number) => void
  /** Pages by whole months, carrying the focused day of month across. */
  step: (count: number) => void
  prev: () => void
  next: () => void
  show: (view: DatePickerView) => void
  /** Moves the selection (when there is one) and the focus to `year`, then returns to the date view. */
  setYear: (year: number) => void
}

/** `YYYY-MM-DD`: a structural check so an unparseable model no-ops instead of turning the anchor into `NaN`. */
const SHAPE = /^\d{4}-\d{2}-\d{2}$/

function shaped (value: unknown): value is string {
  return isString(value) && SHAPE.test(value)
}

function pad (value: number): string {
  return String(value).padStart(2, '0')
}

/**
 * Local parts, not `toISOString()`: UTC lands on the previous day west of
 * Greenwich. The year pads to four digits because every comparison downstream
 * is lexicographic.
 */
export function toIso (value: Date): string {
  return `${String(value.getFullYear()).padStart(4, '0')}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}`
}

/** Every `Date` here is built from parts, because the two-digit-year constructor folds 0 to 99 into the 1900s. */
function build (year: number, month: number, day: number): Date {
  const result = new Date(year, month, day)

  if (year >= 0 && year <= 99) result.setFullYear(result.getFullYear() - 1900)

  return result
}

/** Local parts, never `new Date(iso)`, which reads `YYYY-MM-DD` as UTC midnight. */
export function fromIso (value: string): Date {
  const [year = 0, month = 1, day = 1] = value.split('-').map(Number)

  return build(year, month - 1, day)
}

function days (value: Date, amount: number): Date {
  return build(value.getFullYear(), value.getMonth(), value.getDate() + amount)
}

/** Day 0 of the next month is the last day of the target one, which clamps January 31 to February 28. */
function months (value: Date, amount: number): Date {
  const target = build(value.getFullYear(), value.getMonth() + amount, 1)
  const last = build(target.getFullYear(), target.getMonth() + 1, 0).getDate()

  target.setDate(Math.min(value.getDate(), last))

  return target
}

/** Months since year zero: the total order paging walks. */
function ordinal (anchor: string): number {
  const [year = 0, month = 1] = anchor.split('-').map(Number)

  return year * 12 + month - 1
}

function key (value: number): string {
  const year = Math.floor(value / 12)

  return `${String(year).padStart(4, '0')}-${pad(value - year * 12 + 1)}`
}

/** Milliseconds until the next local midnight; `days()` builds at midnight, so the delta is the rest of the day. */
function midnight (): number {
  const now = new Date()

  return days(now, 1).getTime() - now.getTime()
}

/**
 * Creates the state behind `QuDatePicker`.
 *
 * @param options The model ref, the first weekday and the year window.
 * @returns A `DatePickerCoreContext`.
 *
 * @see https://0.vuetifyjs.com/systems/quantum/date-picker
 *
 * @example
 * ```ts
 * const value = shallowRef<string | undefined>()
 * const picker = createDatePickerCore({ value, firstDayOfWeek: 1 })
 *
 * picker.weeks.value.length // 6
 * picker.select('2017-04-13')
 * value.value // '2017-04-13'
 * ```
 */
export function createDatePickerCore (options: DatePickerCoreOptions): DatePickerCoreContext {
  const { value, firstDayOfWeek, span = 100 } = options

  const engine = useDatePickerEngine()

  const today = shallowRef(toIso(new Date()))

  // `repeat` re-reads the duration after each fire, so every cycle measures afresh to the next local midnight.
  const timer = useTimer(() => {
    today.value = toIso(new Date())
  }, { duration: midnight, repeat: true })

  if (IN_BROWSER) timer.start()

  const opening = shaped(value.value) ? value.value : today.value

  const anchor = shallowRef(opening.slice(0, 7))
  const focused = shallowRef(opening)
  const view = shallowRef<DatePickerView>('date')

  function focus (iso: string) {
    if (!shaped(iso)) return

    focused.value = iso

    const target = iso.slice(0, 7)

    if (target !== anchor.value) anchor.value = target
  }

  function select (iso: string) {
    if (!shaped(iso)) return

    value.value = iso
    focus(iso)
  }

  function peek (unit: DatePickerUnit, amount: number): string {
    const from = fromIso(focused.value)

    switch (unit) {
      case 'month': {
        return toIso(months(from, amount))
      }
      case 'year': {
        return toIso(months(from, amount * 12))
      }
      case 'week': {
        return toIso(days(from, amount * 7))
      }
      default: {
        return toIso(days(from, amount))
      }
    }
  }

  function move (unit: DatePickerUnit, amount: number) {
    focus(peek(unit, amount))
  }

  // A model written from outside (a dialog reopening on its committed value)
  // brings the visible month and the focus with it; `select` already did both.
  watch(value, next => {
    if (shaped(next) && next !== focused.value) focus(next)
  })

  /** Lands the focused day in `target`, keeping its day of month clamped to the target's length. */
  function step (count: number) {
    const target = key(ordinal(anchor.value) + count)
    const delta = ordinal(target) - ordinal(focused.value.slice(0, 7))

    focused.value = toIso(months(fromIso(focused.value), delta))
    anchor.value = target
  }

  function show (next: DatePickerView) {
    view.value = next
  }

  const current = toRef(() => (shaped(value.value) ? value.value : focused.value))

  const year = toRef(() => fromIso(current.value).getFullYear())

  function setYear (target: number) {
    const base = fromIso(current.value)
    const landed = months(base, (target - base.getFullYear()) * 12)
    const iso = toIso(landed)

    if (shaped(value.value)) value.value = iso

    focus(iso)
    show('date')
  }

  // Folded into 0 to 6: an 8 or a -1 would otherwise give a negative lead
  // in `weeks` and drop the first days of a month out of the grid.
  const first = toRef(() => {
    const raw = toValue(firstDayOfWeek)
    const day = isNumber(raw) && Number.isFinite(raw) ? Math.trunc(raw) : engine.first()

    return ((day % 7) + 7) % 7
  })

  const weekdays = computed(() => engine.weekdays(first.value))

  // Six rows always: the pickers page draws the portrait surface at 484 dp with six week rows.
  const weeks = computed((): DatePickerCell[][] => {
    const start = fromIso(`${anchor.value}-01`)
    const lead = (start.getDay() - first.value + 7) % 7
    const origin = days(start, -lead)
    const now = today.value
    const month = anchor.value

    return Array.from({ length: 6 }, (_, week) => Array.from({ length: 7 }, (_, day): DatePickerCell => {
      const date = days(origin, week * 7 + day)
      const iso = toIso(date)

      return {
        iso,
        day: date.getDate(),
        today: iso === now,
        outside: !iso.startsWith(month),
      }
    }))
  })

  const years = computed((): DatePickerYear[] => {
    const count = clamp(Math.floor(span), 0, 1000)

    return range(2 * count + 1, year.value - count).map(value => ({
      year: value,
      label: engine.year(build(value, 0, 1)),
    }))
  })

  return {
    anchor,
    focused,
    view,
    today,
    current,
    heading: toRef(() => engine.heading(fromIso(current.value))),
    year,
    yearLabel: toRef(() => engine.year(fromIso(current.value))),
    label: toRef(() => engine.month(fromIso(`${anchor.value}-01`))),
    weeks,
    weekdays,
    years,
    name: iso => engine.full(fromIso(iso)),
    isSelected: iso => value.value === iso,
    select,
    focus,
    peek,
    move,
    step,
    prev: () => step(-1),
    next: () => step(1),
    show,
    setYear,
  }
}
