/**
 * @module createCalendar
 *
 * @see https://0.vuetifyjs.com/composables/forms/create-calendar
 *
 * @remarks
 * Gregorian month grid with single and range selection. The visible month
 * and the focused day correct each other. Days outside `min` and `max` are
 * disabled. A separate predicate marks days unavailable. Spill days are
 * visible and not selectable.
 *
 * Keyboard handling belongs to a component. This factory exposes `move`,
 * `step`, `goto`, `next`, `prev`, `first`, and `last`.
 *
 * @example
 * ```ts
 * import { createCalendar } from '@vuetify/v0'
 *
 * const calendar = createCalendar({ month: '2026-08', min: '2026-08-10' })
 *
 * calendar.select('2026-08-12')
 * calendar.month.value.weeks
 * ```
 */

// Composables
import { useContext } from '#v0/composables/createContext'
import { useTimer } from '#v0/composables/useTimer'

// Adapters
import { PlainDateAdapter } from '#v0/composables/useDate/adapters/plain'

// Globals
import { IN_BROWSER } from '#v0/constants/globals'

// Utilities
import { clamp, isFunction, isNull, isNumber, isObject, isString, isUndefined } from '#v0/utilities'
import { computed, getCurrentScope, hasInjectionContext, isReadonly, isRef, ref, shallowRef, toRef, toValue, watch, watchEffect } from 'vue'

// Types
import type { DateAdapter } from '#v0/composables/useDate/adapters'
import type { ComputedRef, MaybeRef, MaybeRefOrGetter, Ref } from 'vue'

/** `YYYY-MM` or `YYYY-MM-DD`. Structural only, so a bad string no-ops. */
const SHAPE = /^\d{4}-\d{2}(?:-\d{2})?$/

export interface CalendarCell {
  /** `YYYY-MM-DD`. */
  iso: string
  /** Day of the month, 1–31. */
  day: number
  /** Leading or trailing spill. Not selectable. */
  outside: boolean
  /** `min`, `max`, or the whole control. */
  disabled: boolean
  /** Caller predicate. Independent of `disabled`. */
  unavailable: boolean
  today: boolean
  selected: boolean
  focused: boolean
}

export interface CalendarMonth {
  /** `YYYY-MM`. */
  anchor: string
  weeks: CalendarCell[][]
}

/**
 * Inclusive range. `start` without `end` is an open range.
 *
 * @example
 * ```ts
 * const calendar = createCalendar({ mode: 'range', month: '2026-08' })
 *
 * calendar.select('2026-08-10')
 * calendar.select('2026-08-12')
 * calendar.value.value // { start: '2026-08-10', end: '2026-08-12' }
 * ```
 */
export interface CalendarRange {
  start?: string
  end?: string
}

export type CalendarValue = string | CalendarRange | undefined

export type CalendarMode = 'single' | 'range'

export type CalendarUnit = 'day' | 'week' | 'month' | 'year'

export type CalendarWeekdayFormat = 'long' | 'short' | 'narrow'

/**
 * Options for `createCalendar`.
 *
 * @example
 * ```ts
 * const calendar = createCalendar({
 *   mode: 'single',
 *   month: '2026-08',
 *   min: '2026-08-01',
 *   max: '2026-08-31',
 *   unavailable: iso => iso === '2026-08-15',
 *   firstDayOfWeek: 1,
 * })
 * ```
 */
export interface CalendarOptions<Z = Date> {
  /**
   * Date engine. Omit it to borrow an installed date plugin, or to use
   * `PlainDateAdapter` when none is installed. An adapter you pass is not
   * replaced, and its `firstDayOfWeek` is not written.
   */
  adapter?: DateAdapter<Z>
  /** Namespace of an installed date plugin. @default 'v0:date' */
  namespace?: string
  /** Visible month, `YYYY-MM`. Uncontrolled when omitted. */
  month?: MaybeRefOrGetter<string | undefined>
  /** Selected day, or a range. A ref is written back. */
  value?: MaybeRefOrGetter<CalendarValue>
  /** @default 'single' */
  mode?: CalendarMode
  /** `YYYY-MM-DD`. Days before it are disabled. */
  min?: MaybeRefOrGetter<string | undefined>
  /** `YYYY-MM-DD`. Days after it are disabled. */
  max?: MaybeRefOrGetter<string | undefined>
  /** Disables every day. Navigation still runs. */
  disabled?: MaybeRefOrGetter<boolean>
  /**
   * Per-day rejection. A bare function is called with the ISO day.
   * It is not passed through `toValue`, which would invoke it with no argument.
   */
  unavailable?: MaybeRef<((iso: string) => boolean) | undefined> | ComputedRef<((iso: string) => boolean) | undefined>
  /** `select` no-ops. Cells are not marked disabled. */
  readonly?: MaybeRefOrGetter<boolean>
  /** 0 = Sunday. Overrides the adapter without writing the adapter. */
  firstDayOfWeek?: MaybeRefOrGetter<number | undefined>
  /** Pad the grid to six rows. @default false */
  fixedWeeks?: MaybeRefOrGetter<boolean>
  /** Second click keeps the day. @default false */
  preventDeselect?: MaybeRefOrGetter<boolean>
  /** Applied only when this call constructs its own adapter. */
  locale?: MaybeRefOrGetter<string | undefined>
  /** @default 'narrow' */
  weekdayFormat?: CalendarWeekdayFormat
}

/**
 * Month grid and selection.
 *
 * @example
 * ```ts
 * const calendar = createCalendar({ month: '2026-08' })
 *
 * calendar.today()       // pages to today, selects nothing
 * calendar.selectToday() // selects today when that day is allowed
 * calendar.value.value
 * ```
 */
export interface CalendarContext {
  /** The visible month. One object, not an array. */
  month: ComputedRef<CalendarMonth>
  weekdays: ComputedRef<string[]>
  /** Localized month and year. */
  label: ComputedRef<string>
  /** `YYYY-MM`. */
  anchor: Readonly<Ref<string>>
  /** `YYYY-MM-DD` navigation follows. May sit on a disabled in-month day. */
  focused: Readonly<Ref<string>>
  /** ISO day, or `{ start, end }` in range mode. */
  value: Readonly<Ref<CalendarValue>>
  /** At the `min` month. */
  isFirst: Readonly<Ref<boolean>>
  /** At the `max` month. */
  isLast: Readonly<Ref<boolean>>
  /**
   * Selects an in-month day that is neither disabled nor unavailable.
   * A second click clears, unless `preventDeselect` is set.
   *
   * @example
   * ```ts
   * calendar.select('2026-08-12')
   * calendar.select('2026-08-12') // clears
   * ```
   */
  select: (iso: string) => void
  /** Clears the selection. */
  unselect: () => void
  /**
   * Pages to the current month and focuses today. Selects nothing.
   *
   * @example
   * ```ts
   * calendar.today()
   * calendar.value.value // unchanged
   * ```
   */
  today: () => void
  /**
   * Focuses today and selects it when that day is allowed.
   *
   * @example
   * ```ts
   * calendar.selectToday()
   * ```
   */
  selectToday: () => void
  next: () => void
  prev: () => void
  /** Page by whole months, clamped to `min` and `max`. */
  step: (count: number) => void
  /** `YYYY-MM` or `YYYY-MM-DD`. Pages and focuses. */
  goto: (value: string) => void
  /**
   * Walks the focused day and pages when it leaves the month.
   * A step past `min` or `max` lands on that wall.
   */
  move: (unit: CalendarUnit, amount: number) => void
  /** Page to the `min` month. No-op when `min` is unset. */
  first: () => void
  /** Page to the `max` month. No-op when `max` is unset. */
  last: () => void
}

interface DateSource<Z> {
  adapter: DateAdapter<Z>
  locale: ComputedRef<string | undefined>
  firstDayOfWeek: ComputedRef<number>
}

function ordinal (anchor: string) {
  const parts = anchor.split('-')
  const year = Number(parts[0])
  const month = Number(parts[1])

  return year * 12 + month - 1
}

function key (value: number) {
  const year = Math.floor(value / 12)

  return `${String(year).padStart(4, '0')}-${String(value - year * 12 + 1).padStart(2, '0')}`
}

function shaped (value: unknown): value is string {
  return isString(value) && SHAPE.test(value)
}

function limit (value: MaybeRefOrGetter<string | undefined> | undefined) {
  const resolved = toValue(value)

  return shaped(resolved) ? resolved : undefined
}

function weekIndex (day: number) {
  const index = Math.trunc(day) % 7

  return index < 0 ? index + 7 : index
}

/**
 * Gregorian month grid.
 *
 * Selection lives here. Pass `mode: 'range'` for a start and end on the same
 * grid. `today()` pages and focuses without selecting. `selectToday()` selects
 * when the day is allowed.
 *
 * @param options Month, selection, and bounds.
 * @returns The calendar context.
 *
 * @see https://0.vuetifyjs.com/composables/forms/create-calendar
 *
 * @example
 * ```ts
 * const calendar = createCalendar({
 *   month: '2026-02',
 *   firstDayOfWeek: 0,
 * })
 *
 * calendar.month.value.weeks.length // 4
 * ```
 */
export function createCalendar<Z> (
  options: CalendarOptions<Z> & { adapter: DateAdapter<Z> },
): CalendarContext
export function createCalendar (options?: CalendarOptions<Date>): CalendarContext
export function createCalendar<Z = Date> (options: CalendarOptions<Z> = {}): CalendarContext {
  const {
    adapter: provided,
    namespace = 'v0:date',
    month,
    value: source,
    mode = 'single',
    min,
    max,
    disabled,
    unavailable,
    readonly,
    firstDayOfWeek,
    fixedWeeks,
    preventDeselect,
    locale,
    weekdayFormat = 'narrow',
  } = options

  const resolved = resolveAdapter(provided, namespace)
  const adapter = resolved.adapter
  const owned = resolved.owned
  const context = resolved.context

  if (owned && !isUndefined(locale)) {
    function applyLocale () {
      const next = toValue(locale)

      if (isString(next) && adapter.locale !== next) adapter.locale = next
    }

    applyLocale()

    if (getCurrentScope()) watchEffect(applyLocale)
  }

  function floor () {
    const value = limit(min)

    return isUndefined(value) ? Number.NEGATIVE_INFINITY : ordinal(value.slice(0, 7))
  }

  function ceiling () {
    const value = limit(max)

    return isUndefined(value) ? Number.POSITIVE_INFINITY : ordinal(value.slice(0, 7))
  }

  function wall (value: string) {
    return key(clamp(ordinal(value), floor(), ceiling()))
  }

  function bound (iso: string) {
    const low = limit(min)
    const high = limit(max)

    if (!isUndefined(low) && iso < low) return low
    if (!isUndefined(high) && iso > high) return high

    return iso
  }

  function currentIso () {
    const today = adapter.date()

    if (isNull(today)) return '1970-01-01'

    return adapter.toISO(today)
  }

  const now = shallowRef(currentIso())

  // No scope means the midnight interval cannot be stopped.
  if (IN_BROWSER && getCurrentScope()) {
    const timer = useTimer(() => {
      now.value = currentIso()
    }, {
      duration: () => untilMidnight(adapter),
      repeat: true,
    })

    timer.start()
  }

  function entry (value: string) {
    return bound(now.value.startsWith(value) ? now.value : `${value}-01`)
  }

  const opening = toValue(month)
  const anchor = shallowRef(wall(shaped(opening) ? opening.slice(0, 7) : now.value.slice(0, 7)))
  const focused = shallowRef(entry(anchor.value))

  function shiftMonth (iso: string, count: number) {
    return adapter.toISO(adapter.addMonths(adapter.parseISO(iso), count))
  }

  function carry (value: string) {
    const delta = ordinal(value) - ordinal(focused.value.slice(0, 7))
    const shifted = shiftMonth(focused.value, delta)

    return shifted.startsWith(value) ? bound(shifted) : entry(value)
  }

  function place (target: string) {
    anchor.value = target

    if (!isRef(month) || isReadonly(month)) return

    const current = month.value

    if (!isString(current) || current.slice(0, 7) !== target) setRef(month, target)
  }

  function goto (value: string) {
    if (!shaped(value)) return

    const target = wall(value.slice(0, 7))

    focused.value = value.length > 7 && value.startsWith(target) ? bound(value) : entry(target)
    place(target)
  }

  function step (count: number) {
    const target = wall(key(ordinal(anchor.value) + count))

    focused.value = carry(target)
    place(target)
  }

  function move (unit: CalendarUnit, amount: number) {
    const from = adapter.parseISO(focused.value)
    let to: Z

    switch (unit) {
      case 'month': {
        to = adapter.addMonths(from, amount)
        break
      }
      case 'year': {
        to = adapter.addYears(from, amount)
        break
      }
      case 'week': {
        to = adapter.addDays(from, amount * 7)
        break
      }
      default: {
        to = adapter.addDays(from, amount)
      }
    }

    const iso = adapter.toISO(to)
    const low = limit(min)
    const high = limit(max)

    if (!isUndefined(low) && iso < low) {
      goto(low)

      return
    }

    if (!isUndefined(high) && iso > high) {
      goto(high)

      return
    }

    focused.value = iso

    const target = iso.slice(0, 7)

    if (target !== anchor.value) place(target)
  }

  const picked = shallowRef<string | undefined>()
  const span = ref<CalendarRange>({})

  function assign (incoming: CalendarValue) {
    if (mode === 'range') {
      const next = readRange(incoming)

      if (span.value.start === next.start && span.value.end === next.end) return

      span.value = next

      return
    }

    const next = isString(incoming) ? incoming : undefined

    if (picked.value === next) return

    picked.value = next
  }

  function commit (incoming: CalendarValue) {
    assign(incoming)

    if (!isRef(source) || isReadonly(source)) return

    const outgoing: CalendarValue = mode === 'range'
      ? { start: span.value.start, end: span.value.end }
      : picked.value

    if (sameValue(source.value, outgoing)) return

    setRef(source, outgoing)
  }

  assign(toValue(source))

  function weekStartOf (date: Z, first: number) {
    const diff = (adapter.toJsDate(date).getDay() - first + 7) % 7

    return adapter.startOfDay(adapter.addDays(date, -diff))
  }

  function resolvedFirst () {
    const explicit = toValue(firstDayOfWeek)

    if (isNumber(explicit)) return weekIndex(explicit)
    if (context) return context.firstDayOfWeek.value

    return adapter.firstDayOfWeek
  }

  function resolvedLocale () {
    if (context) {
      const value = context.locale.value

      if (isString(value)) return value
    }

    if (owned) {
      const value = toValue(locale)

      if (isString(value)) return value
    }

    return adapter.locale
  }

  function rejected (iso: string) {
    if (isUndefined(unavailable)) return false

    // toValue invokes a function. A predicate must run with the day.
    if (isFunction(unavailable)) return unavailable(iso)

    const predicate = toValue(unavailable)

    return isFunction(predicate) ? predicate(iso) : false
  }

  function walled (iso: string) {
    const low = limit(min)
    const high = limit(max)

    return (!isUndefined(low) && iso < low) || (!isUndefined(high) && iso > high)
  }

  function chosen (iso: string) {
    if (mode === 'range') {
      const start = span.value.start
      const end = span.value.end

      if (!isString(start)) return false
      if (!isString(end)) return iso === start

      const ends = [start, end].toSorted()
      const low = ends[0] ?? start
      const high = ends[1] ?? end

      return iso >= low && iso <= high
    }

    return iso === picked.value
  }

  const shown = computed((): CalendarMonth => {
    const value = anchor.value
    const first = resolvedFirst()
    const fixed = toValue(fixedWeeks) === true
    const cursor = adapter.parseISO(`${value}-01`)
    const start = weekStartOf(adapter.startOfMonth(cursor), first)
    const end = adapter.endOfDay(adapter.addDays(weekStartOf(adapter.endOfMonth(cursor), first), 6))
    const today = now.value
    const locked = toValue(disabled) === true
    let current = start
    const weeks: CalendarCell[][] = []

    while (weeks.length < 6) {
      if (adapter.isAfter(current, end) && !fixed) break

      const week: CalendarCell[] = []

      for (let day = 0; day < 7; day++) {
        const iso = adapter.toISO(current)

        week.push({
          iso,
          day: adapter.getDate(current),
          outside: !iso.startsWith(value),
          disabled: locked || walled(iso),
          unavailable: rejected(iso),
          today: iso === today,
          selected: chosen(iso),
          focused: iso === focused.value,
        })

        current = adapter.addDays(current, 1)
      }

      weeks.push(week)
    }

    return { anchor: value, weeks }
  })

  const weekdays = computed(() => {
    const first = resolvedFirst()
    const formatter = new Intl.DateTimeFormat(resolvedLocale(), { weekday: weekdayFormat })

    return Array.from({ length: 7 }, (_, index) => {
      return formatter.format(new Date(2015, 0, 4 + ((index + first) % 7)))
    })
  })

  const label = computed(() => {
    // Locale is a class field. Read the ref so a plugin locale change rebuilds the label.
    void resolvedLocale()

    const cursor = adapter.parseISO(`${anchor.value}-01`)

    return adapter.format(adapter.startOfMonth(cursor), 'monthAndYear')
  })

  function find (iso: string) {
    for (const week of shown.value.weeks) {
      for (const cell of week) {
        if (cell.iso === iso) return cell
      }
    }

    return undefined
  }

  function select (iso: string) {
    if (toValue(readonly) === true) return

    const cell = find(iso)

    if (!cell || cell.outside || cell.disabled || cell.unavailable) return

    focused.value = iso

    if (mode === 'range') {
      const start = span.value.start
      const end = span.value.end

      if (!isString(start) || isString(end)) {
        commit({ start: iso })

        return
      }

      if (iso < start) {
        commit({ start: iso })

        return
      }

      commit({ start, end: iso })

      return
    }

    if (picked.value === iso && toValue(preventDeselect) !== true) {
      commit(undefined)

      return
    }

    commit(iso)
  }

  function unselect () {
    if (toValue(readonly) === true) return

    commit(undefined)
  }

  function today () {
    goto(now.value)
  }

  function selectToday () {
    today()
    select(now.value)
  }

  if (getCurrentScope()) {
    watch(anchor, value => {
      if (focused.value.startsWith(value)) return

      focused.value = carry(value)
    }, { flush: 'sync' })

    if (!isUndefined(month)) {
      watch(() => toValue(month), incoming => {
        if (!shaped(incoming)) return

        const target = wall(incoming.slice(0, 7))

        if (target !== anchor.value) anchor.value = target

        if (isRef(month) && !isReadonly(month)) {
          const current = month.value

          if (incoming.slice(0, 7) !== target && (!isString(current) || current.slice(0, 7) !== target)) {
            setRef(month, target)
          }
        }
      })
    }

    watch(() => [limit(min), limit(max)] as const, () => {
      const next = wall(anchor.value)

      if (next !== anchor.value) {
        place(next)

        return
      }

      const landed = bound(focused.value)

      if (landed !== focused.value) focused.value = landed
    })

    if (!isUndefined(source)) {
      watch(() => toValue(source), assign)
    }
  }

  return {
    month: shown,
    weekdays,
    label,
    anchor,
    focused,
    value: (mode === 'range' ? span : picked) as Readonly<Ref<CalendarValue>>,
    isFirst: toRef(() => ordinal(anchor.value) <= floor()),
    isLast: toRef(() => ordinal(anchor.value) >= ceiling()),
    select,
    unselect,
    today,
    selectToday,
    next: () => step(1),
    prev: () => step(-1),
    step,
    goto,
    move,
    first: () => {
      const low = limit(min)

      if (!isUndefined(low)) goto(low.slice(0, 7))
    },
    last: () => {
      const high = limit(max)

      if (!isUndefined(high)) goto(high.slice(0, 7))
    },
  }
}

function resolveAdapter<Z> (
  provided: DateAdapter<Z> | undefined,
  namespace: string,
): { adapter: DateAdapter<Z>, owned: boolean, context: DateSource<Z> | undefined } {
  if (provided) {
    return { adapter: provided, owned: false, context: undefined }
  }

  if (hasInjectionContext()) {
    const installed = useContext<DateSource<Z> | null>(namespace, null)

    if (!isNull(installed)) {
      return { adapter: installed.adapter, owned: false, context: installed }
    }
  }

  return {
    adapter: new PlainDateAdapter() as unknown as DateAdapter<Z>,
    owned: true,
    context: undefined,
  }
}

function setRef<T> (source: MaybeRefOrGetter<T> | undefined, next: T) {
  if (!isRef(source) || isReadonly(source)) return

  // ComputedRef shares the Ref shape and keeps `value` readonly. A predicate
  // does not drop it, so the write goes through a cast after the runtime check.
  ;(source as unknown as Ref<T>).value = next
}

function untilMidnight<Z> (adapter: DateAdapter<Z>) {
  const current = adapter.date()

  if (isNull(current)) return 86_400_000

  const next = adapter.startOfDay(adapter.addDays(current, 1))
  const ms = adapter.toJsDate(next).getTime() - adapter.toJsDate(current).getTime()

  return ms > 0 ? ms : 86_400_000
}

function readRange (value: CalendarValue): CalendarRange {
  if (!isObject(value)) return {}

  const start = value.start
  const end = value.end

  return {
    start: isString(start) ? start : undefined,
    end: isString(end) ? end : undefined,
  }
}

function sameValue (left: CalendarValue, right: CalendarValue) {
  if (isString(left) || isUndefined(left)) return left === right
  if (!isObject(left) || !isObject(right)) return false

  return left.start === right.start && left.end === right.end
}
