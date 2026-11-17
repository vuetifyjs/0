/**
 * @module createTimePicker
 *
 * @see https://0.vuetifyjs.com/composables/forms/create-time-picker
 *
 * @remarks
 * Segmented time value. Hour, minute, and optional second stay in separate
 * fields. The public value is a 24-hour `HH:mm` or `HH:mm:ss` string, and it
 * stays `null` until every enabled field is set. `h12` keeps a meridiem and
 * still stores the canonical hour in 24-hour form.
 *
 * Each field moves on a cyclic grid: the multiples of its step inside the
 * cycle, anchored at `0` on the stored 24-hour value. Stepping wraps around
 * the grid; snapping goes to the nearest grid point and never wraps. A
 * complete value that falls outside `min` / `max` moves to the nearest
 * on-grid time inside them.
 *
 * Does not read the DOM, `window`, or the date plugin. To follow the locale,
 * map the date adapter yourself:
 * `hourCycle: date.is12HourCycleInCurrentLocale() ? 'h12' : 'h23'`.
 *
 * @example
 * ```ts
 * import { shallowRef } from 'vue'
 * import { createTimePicker } from '@vuetify/v0'
 *
 * const value = shallowRef<string | null>('15:30')
 * const time = createTimePicker({ value, hourCycle: 'h12' })
 *
 * time.hour.value // 3
 * time.commit('minute', 0)
 * time.step('hour', -1)
 * time.value.value // '14:00'
 * ```
 */

// Composables
import { useLogger } from '#v0/composables/useLogger'

// Utilities
import { clamp, isNull, isNullOrUndefined, isNumber, isString, isUndefined } from '#v0/utilities'
import { nextTick, onScopeDispose, shallowRef, toRef, toValue, watch } from 'vue'

// Types
import type { MaybeRefOrGetter, Ref } from 'vue'

export type TimeHourCycle = 'h12' | 'h23'

export type TimePeriod = 'am' | 'pm'

/** One segment of the time value. */
export type TimePart = 'hour' | 'minute' | 'second' | 'period'

/** A segment that holds a number: every part but the period. */
export type TimeUnit = Exclude<TimePart, 'period'>

/**
 * The values a numeric field can show, in display terms.
 *
 * @example
 * ```ts
 * const time = createTimePicker({ minuteStep: 15 })
 * time.grid('minute') // { min: 0, max: 45, step: 15 }
 * ```
 */
export interface TimeGrid {
  /** Lowest value the field can show. */
  min: number
  /** Highest value the field can show. */
  max: number
  /** Resolved step: a whole number, at least `1`. */
  step: number
}

/**
 * @example
 * ```ts
 * createTimePicker({
 *   hourCycle: 'h23',
 *   seconds: false,
 *   minuteStep: 15,
 *   min: '09:00',
 *   max: '17:00',
 * })
 * ```
 */
export interface TimePickerOptions {
  /**
   * Canonical `HH:mm` or `HH:mm:ss` source. An incoming value is snapped to
   * the step grid, moved to the nearest on-grid time inside `min` / `max`
   * when it falls outside them, and written back in canonical form. With `seconds` on, `HH:mm` reads as second `0`; with it off,
   * `HH:mm:ss` drops the seconds. An unparseable value empties the fields
   * and becomes `null`. That pass runs before the next flush, together
   * with any option that changed in the same tick; until then the fields
   * show the value as written.
   *
   * The model has the last word. When, after its owner has had a tick to
   * answer, it does not hold the value the picker wrote, the fields take
   * the model's value as given and the picker writes nothing further. An
   * owner that answers later than that is treated the same way until its
   * value arrives.
   *
   * @default shallowRef(null)
   */
  value?: Ref<string | null>
  /**
   * `h12` shows 1–12 and a meridiem. `h23` shows 0–23.
   * Any other value is read as `h23`.
   *
   * @default 'h23'
   */
  hourCycle?: MaybeRefOrGetter<TimeHourCycle | undefined>
  /**
   * Include seconds in the canonical value. Turning it on for a picker whose
   * hour and minute are set keeps the time and sets the second to `0`.
   * Turning it off drops the second.
   *
   * @default false
   */
  seconds?: MaybeRefOrGetter<boolean>
  /**
   * Hour interval. The hour moves on the multiples of the step inside
   * `0`–`23`; in `h12`, on those inside the current meridiem's half of the
   * day. Fractions truncate, and a non-finite or non-positive step is read
   * as `1`. A half with no multiple of the step holds its first hour only.
   *
   * @default 1
   */
  hourStep?: MaybeRefOrGetter<number | undefined>
  /**
   * Minute interval. The minute moves on the multiples of the step inside
   * `0`–`59`. Fractions truncate, and a non-finite or non-positive step is
   * read as `1`. A step above `59` leaves `0` as the only minute.
   *
   * @default 1
   */
  minuteStep?: MaybeRefOrGetter<number | undefined>
  /**
   * Second interval. Same rules as `minuteStep`.
   *
   * @default 1
   */
  secondStep?: MaybeRefOrGetter<number | undefined>
  /**
   * Inclusive lower bound, `HH:mm` or `HH:mm:ss`. Applies to a complete
   * value only. A value below it moves to the earliest time at or after
   * `min` that is on every field's step grid; with `minuteStep: 15`,
   * `min: '10:07'` starts the range at `10:15`. Only when no on-grid time
   * lies between `min` and `max` is the grid set aside and the value
   * clamped to the bound itself. The bound's seconds are ignored while
   * `seconds` is off, so `min: '09:00:30'` then admits `09:00`. An
   * unparseable `min` is ignored on its own; a `min` above `max`, compared
   * the same way, turns both bounds off.
   */
  min?: MaybeRefOrGetter<string | null | undefined>
  /**
   * Inclusive upper bound, `HH:mm` or `HH:mm:ss`. Applies to a complete
   * value only. A value above it moves to the latest time at or before
   * `max` that is on every field's step grid; with `minuteStep: 15`,
   * `max: '17:10'` ends the range at `17:00`. Only when no on-grid time
   * lies between `min` and `max` is the grid set aside and the value
   * clamped to the bound itself. The bound's seconds are ignored while
   * `seconds` is off, so `max: '17:00:30'` then stops at `17:00`. An
   * unparseable `max` is ignored on its own; a `max` below `min`, compared
   * the same way, turns both bounds off.
   */
  max?: MaybeRefOrGetter<string | null | undefined>
  /**
   * While true, `commit`, `step`, and `clear` do nothing and the picker
   * never writes `value`, so the model is left untouched. The fields show
   * the incoming hour and minute as given, unsnapped and unclamped, and
   * its seconds only while `seconds` is on. Turning it off normalizes the
   * value.
   *
   * @default false
   */
  disabled?: MaybeRefOrGetter<boolean>
  /**
   * While true, `commit`, `step`, and `clear` do nothing and the picker
   * never writes `value`, so the model is left untouched. The fields show
   * the incoming hour and minute as given, unsnapped and unclamped, and
   * its seconds only while `seconds` is on. Turning it off normalizes the
   * value.
   *
   * @default false
   */
  readonly?: MaybeRefOrGetter<boolean>
}

export interface TimePickerContext {
  /**
   * Canonical 24-hour value, or `null` while a field is still empty.
   * Writing it from outside replaces every field at once; the picker
   * normalizes it before the next flush. The picker writes it on every
   * edit, and never while disabled or readonly.
   *
   * @example
   * ```ts
   * const time = createTimePicker({ seconds: true })
   * time.value.value = '09:30'
   * time.hour.value // 9
   * await nextTick()
   * time.value.value // '09:30:00'
   * ```
   */
  readonly value: Ref<string | null>
  /**
   * Field hour. `0`–`23` in `h23`, `1`–`12` in `h12`. `null` when unset.
   *
   * @example
   * ```ts
   * const time = createTimePicker({ hourCycle: 'h12' })
   * time.commit('hour', 3)
   * time.hour.value // 3
   * ```
   */
  readonly hour: Readonly<Ref<number | null>>
  /** Minute field, `0`–`59`, or `null` when unset. */
  readonly minute: Readonly<Ref<number | null>>
  /** Second field, or `null` when seconds are off or unset. */
  readonly second: Readonly<Ref<number | null>>
  /**
   * Meridiem. `null` in `h23`. In `h12` with an empty hour, the remembered
   * meridiem: the last one committed, the one the hour had when it was
   * cleared, or the one of the last incoming value. `clear()` and an
   * incoming `null`, `''`, or unparseable value reset it to `'am'`.
   *
   * @example
   * ```ts
   * const time = createTimePicker({ hourCycle: 'h12' })
   * time.commit('hour', 3)
   * time.commit('minute', 0)
   * time.commit('period', 'pm')
   * time.period.value // 'pm'
   * time.value.value // '15:00'
   * ```
   */
  readonly period: Readonly<Ref<TimePeriod | null>>
  /** Resolved hour cycle. */
  readonly hourCycle: Readonly<Ref<TimeHourCycle>>
  /** Whether the canonical value includes seconds. */
  readonly seconds: Readonly<Ref<boolean>>
  /** Resolved disabled flag. */
  readonly isDisabled: Readonly<Ref<boolean>>
  /** Resolved readonly flag. */
  readonly isReadonly: Readonly<Ref<boolean>>
  /**
   * Set one field. `null` clears a numeric field and the value becomes
   * `null`. A number is held inside the field's range and snapped to the
   * nearest grid point without wrapping. In `h12` the hour is read as a
   * display hour in the current meridiem. A period commit moves a set hour
   * to the other half of the day, and is remembered while the hour is
   * empty.
   *
   * The edit works on what the fields show. A value or option changed
   * earlier in the same tick is applied first; a value the fields took as
   * given after a refused write is not. The edited field follows the rules
   * above, then the whole time is normalized and written once.
   *
   * Writes nothing for `period` in `h23`, for the period already shown,
   * for `second` while seconds are off, for `null` on an empty field, and
   * for a non-finite number, unless a change from the same tick was still
   * waiting, which is then published.
   *
   * @example
   * ```ts
   * const time = createTimePicker({ minuteStep: 15 })
   * time.commit('hour', 9)
   * time.value.value // null
   * time.commit('minute', 58) // snaps to 45, never wraps to 0
   * time.value.value // '09:45'
   * ```
   */
  commit: ((part: TimeUnit, value: number | null) => void) & ((part: 'period', value: TimePeriod) => void)
  /**
   * Move one field along its grid. The sign of `count` is the direction and
   * its magnitude the number of intervals; it defaults to `1`, fractions
   * truncate, and `0` or a non-finite count does nothing. The field wraps
   * past either end, and a value off the grid first moves onto the adjacent
   * grid point. An `h12` hour stays inside its meridiem. An empty field
   * lands on its first grid point, whatever the count: `0` for a minute, a
   * second, or an `h23` hour, and the first hour of the remembered meridiem
   * for an `h12` hour, which is `12` with the default step. Any non-zero
   * count flips the period.
   *
   * The step starts from what the field shows, so a value the fields took
   * as given after a refused write moves onto the adjacent grid point in
   * the direction of travel. A value or option changed earlier in the same
   * tick is applied first. The whole time is then normalized and written
   * once. A count of `0`, a non-finite count, `period` in `h23`, and
   * `second` while seconds are off write nothing, unless a change from the
   * same tick was still waiting, which is then published.
   *
   * @example
   * ```ts
   * const time = createTimePicker({ minuteStep: 15 })
   * time.commit('hour', 23)
   * time.commit('minute', 45)
   * time.step('minute') // 45 wraps to 0
   * time.step('minute', -2) // 0 → 45 → 30
   * time.step('hour', 1)
   * time.value.value // '00:30'
   * ```
   */
  step: (part: TimePart, count?: number) => void
  /**
   * Clear every field and forget the meridiem. The value becomes `null`.
   *
   * @example
   * ```ts
   * const time = createTimePicker({ value: shallowRef('09:30') })
   * time.clear()
   * time.value.value // null
   * time.hour.value // null
   * ```
   */
  clear: () => void
  /**
   * Lowest and highest value a numeric field can show, plus its resolved
   * step. An `h12` hour reports display hours for the current meridiem.
   *
   * @example
   * ```ts
   * const time = createTimePicker({ hourCycle: 'h12', hourStep: 5 })
   * time.grid('hour') // { min: 5, max: 12, step: 5 } — 12, 5, and 10 AM
   * time.commit('period', 'pm')
   * time.grid('hour') // { min: 3, max: 8, step: 5 } — 3 and 8 PM
   * ```
   */
  grid: (part: TimeUnit) => TimeGrid
  /**
   * The time the fields show, as the canonical string, or `null` while a
   * field is empty. It is always the format of the fields, so it differs
   * from `value` whenever the model holds a string the fields cannot show
   * exactly:
   *
   * - an unparseable string, where `display` is `null`
   * - a value a disabled or readonly picker has not normalized
   * - a value the fields took as given after the model refused a write,
   *   when its seconds do not match the `seconds` option: `display` adds
   *   `:00` or leaves the seconds out
   * - a write the model's owner has not answered yet, until the check one
   *   tick later
   *
   * @example
   * ```ts
   * const time = createTimePicker({ value: shallowRef('nope'), readonly: true })
   * time.value.value // 'nope'
   * time.display.value // null
   * ```
   */
  readonly display: Readonly<Ref<string | null>>
}

interface ParsedTime {
  hour: number
  minute: number
  second: number | null
}

interface WholeTime extends ParsedTime {
  second: number
}

interface Snapshot {
  hour: number | null
  minute: number | null
  second: number | null
  period: TimePeriod
  fresh: boolean
  seen: string
  timed: boolean
  settled: unknown
  tried: string | null | undefined
  turns: number
  open: boolean
}

function pad (value: number): string {
  return String(value).padStart(2, '0')
}

function parseTime (raw: string): ParsedTime | null {
  const match = /^(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(raw)
  if (isNull(match)) return null

  const hour = Number(match[1])
  const minute = Number(match[2])
  const second = isUndefined(match[3]) ? null : Number(match[3])

  if (hour > 23 || minute > 59) return null
  if (!isNull(second) && second > 59) return null

  return { hour, minute, second }
}

function to24 (display: number, period: TimePeriod): number {
  const base = display % 12
  return period === 'pm' ? base + 12 : base
}

function displayHour (hour24: number): number {
  return hour24 % 12 || 12
}

function meridiem (hour24: number): TimePeriod {
  return hour24 >= 12 ? 'pm' : 'am'
}

function interval (step: number): number {
  if (!Number.isFinite(step) || step <= 0) return 1
  return Math.max(1, Math.trunc(step))
}

// A range that holds no multiple of the step keeps its first value, so a
// field always has somewhere to land.
function points (low: number, high: number, step: number): number[] {
  const list: number[] = []
  for (let point = Math.ceil(low / step) * step; point <= high; point += step) {
    list.push(point)
  }
  return list.length > 0 ? list : [low]
}

function nearest (list: number[], value: number): number {
  let best = list[0]!
  for (const point of list) {
    if (Math.abs(point - value) <= Math.abs(best - value)) best = point
  }
  return best
}

function travel (list: number[], value: number, count: number): number {
  const size = list.length
  const up = count > 0
  let index = up
    ? list.findIndex(point => point > value)
    : list.findLastIndex(point => point < value)
  if (index < 0) index = up ? 0 : size - 1

  const offset = index + Math.sign(count) * ((Math.abs(count) - 1) % size)
  return list[((offset % size) + size) % size]!
}

/**
 * Creates a segmented time value.
 *
 * @param options Value source, hour cycle, seconds, steps, bounds, and the
 * disabled and readonly flags.
 * @returns The fields, the canonical value, and the methods that edit them.
 *
 * @example
 * ```ts
 * import { shallowRef } from 'vue'
 * import { createTimePicker } from '@vuetify/v0'
 *
 * const value = shallowRef<string | null>(null)
 * const time = createTimePicker({ value, minuteStep: 15, min: '09:00', max: '17:00' })
 *
 * time.commit('hour', 8)
 * time.commit('minute', 50)
 * value.value // '09:00' — 08:45 on the grid, then the first time inside the range
 * time.step('minute', 2)
 * value.value // '09:30'
 * ```
 */
export function createTimePicker (options: TimePickerOptions = {}): TimePickerContext {
  const {
    value = shallowRef<string | null>(null),
    hourCycle: _hourCycle = 'h23',
    seconds: _seconds = false,
    hourStep = 1,
    minuteStep = 1,
    secondStep = 1,
    min = null,
    max = null,
    disabled = false,
    readonly: _readonly = false,
  } = options

  const logger = useLogger()

  const hour24 = shallowRef<number | null>(null)
  const minute = shallowRef<number | null>(null)
  const stored = shallowRef<number | null>(null)
  const pending = shallowRef<TimePeriod>('am')

  // Bumped by an incoming value so its normalization shares one pass with
  // any option that changed alongside it.
  const stale = shallowRef(0)
  // Bumped by a write the model does not hold straight away, so it can be
  // checked once its owner has had its turn to accept or refuse it.
  const sent = shallowRef(0)

  // The value the model and the fields last agreed on. Under a controlled
  // model `value` lags the picker's own writes, so it cannot stand in.
  let settled: unknown
  let live = true
  // A write is out and its owner's answer has not been checked yet. A value
  // that comes in meanwhile is a reply to it.
  let open = false
  // Writes since the current edit, incoming value, or option change began.
  // The first reply is normalized and written back; a reply to that write
  // is taken as given, so an owner that alters every write cannot keep the
  // exchange going.
  let turns = 0
  // The last value written in this exchange. Its owner already answered it
  // with something else, so it is not offered again.
  let tried: string | null | undefined
  // An incoming value is in the fields but the pass has not normalized it.
  let fresh = false
  // The options as the last pass saw them, to tell a change it has not.
  let seen = ''

  const hourCycle = toRef((): TimeHourCycle => toValue(_hourCycle) === 'h12' ? 'h12' : 'h23')
  const seconds = toRef(() => Boolean(toValue(_seconds)))
  const isDisabled = toRef(() => Boolean(toValue(disabled)))
  const isReadonly = toRef(() => Boolean(toValue(_readonly)))

  // Whether seconds counted at the last pass, to tell them turning on.
  let timed = seconds.value

  const hour = toRef((): number | null => {
    if (isNull(hour24.value)) return null
    return hourCycle.value === 'h12' ? displayHour(hour24.value) : hour24.value
  })

  // An incoming value keeps its seconds until the next pass decides whether
  // they count, so the option and the value may arrive in either order.
  const second = toRef(() => seconds.value ? stored.value : null)

  const period = toRef((): TimePeriod | null => {
    if (hourCycle.value !== 'h12') return null
    if (isNull(hour24.value)) return pending.value
    return meridiem(hour24.value)
  })

  const display = toRef(format)

  function blocked (): boolean {
    return isDisabled.value || isReadonly.value
  }

  function stride (part: TimeUnit): number {
    const step = part === 'hour' ? hourStep : (part === 'minute' ? minuteStep : secondStep)
    return interval(toValue(step) ?? 1)
  }

  function hours (half: TimePeriod): number[] {
    const step = stride('hour')
    if (hourCycle.value !== 'h12') return points(0, 23, step)
    return half === 'pm' ? points(12, 23, step) : points(0, 11, step)
  }

  function sixty (part: 'minute' | 'second'): number[] {
    return points(0, 59, stride(part))
  }

  function whole (): WholeTime | null {
    const second = seconds.value ? stored.value : 0
    if (isNull(hour24.value) || isNull(minute.value) || isNull(second)) return null
    return { hour: hour24.value, minute: minute.value, second }
  }

  function total (time: WholeTime): number {
    return time.hour * 3600 + time.minute * 60 + time.second
  }

  function boundSeconds (raw: string | null): number | null {
    if (!isString(raw)) return null
    const parsed = parseTime(raw)
    if (isNull(parsed)) return null
    return total({ ...parsed, second: seconds.value ? parsed.second ?? 0 : 0 })
  }

  function pin (at: number) {
    hour24.value = Math.floor(at / 3600)
    minute.value = Math.floor((at % 3600) / 60)
    if (seconds.value) stored.value = at % 60
  }

  // The on-grid time closest to a bound from inside: the earliest at or
  // after it, or the latest at or before it. Null when there is none.
  function edge (at: number, after: boolean): number | null {
    const hourList = hourCycle.value === 'h12' ? [...hours('am'), ...hours('pm')] : hours('am')
    const minuteList = sixty('minute')
    const secondList = seconds.value ? sixty('second') : [0]

    function order (list: number[]): number[] {
      return after ? list : list.toReversed()
    }

    for (const hour of order(hourList)) {
      if (after ? hour * 3600 + 3599 < at : hour * 3600 > at) continue
      for (const minute of order(minuteList)) {
        const base = hour * 3600 + minute * 60
        if (after ? base + 59 < at : base > at) continue
        for (const second of order(secondList)) {
          if (after ? base + second >= at : base + second <= at) return base + second
        }
      }
    }

    return null
  }

  // Snap, then pull a time outside the range to the nearest on-grid time
  // inside it. A range that holds no on-grid time cannot honor the grid, so
  // there the time is only clamped: snapping first would let a value that
  // was read back land on the other bound.
  function fit () {
    const from = boundSeconds(toValue(min) ?? null)
    const to = boundSeconds(toValue(max) ?? null)
    const ranged = isNull(from) || isNull(to) || from <= to
    const low = ranged ? from : null
    const high = ranged ? to : null

    const first = isNull(low) ? 0 : edge(low, true)
    const empty = isNull(first) || (!isNull(high) && first > high)
    const raw = whole()

    if (empty && !isNull(raw)) {
      if (!isNull(low) && total(raw) < low) pin(low)
      else if (!isNull(high) && total(raw) > high) pin(high)
      return
    }

    if (!isNull(hour24.value)) hour24.value = nearest(hours(meridiem(hour24.value)), hour24.value)
    if (!isNull(minute.value)) minute.value = nearest(sixty('minute'), minute.value)
    if (!isNull(stored.value)) stored.value = nearest(sixty('second'), stored.value)

    const time = whole()
    if (empty || isNull(time)) return
    if (!isNull(low) && total(time) < low) pin(first)
    else if (!isNull(high) && total(time) > high) pin(edge(high, false)!)
  }

  function format (): string | null {
    const time = whole()
    if (isNull(time)) return null

    const text = `${pad(time.hour)}:${pad(time.minute)}`
    return seconds.value ? `${text}:${pad(time.second)}` : text
  }

  function snapshot (): Snapshot {
    return {
      hour: hour24.value,
      minute: minute.value,
      second: stored.value,
      period: pending.value,
      fresh,
      seen,
      timed,
      settled,
      tried,
      turns,
      open,
    }
  }

  function restore (from: Snapshot) {
    hour24.value = from.hour
    minute.value = from.minute
    stored.value = from.second
    pending.value = from.period
    fresh = from.fresh
    seen = from.seen
    timed = from.timed
    settled = from.settled
    tried = from.tried
    turns = from.turns
    open = from.open
  }

  // `from` is the state before the call that led here, for a write that
  // throws to go back to. It carries the pending-change marks: an edit
  // applies a change from the same tick before it writes, and if that write
  // throws the change must be waiting for the pass again. It carries the
  // exchange too: an edit begins a new one before it writes, and if that
  // write throws the one it interrupted must still be running.
  function publish (from = snapshot()) {
    fit()
    const next = format()
    if (next === settled) return
    if (next === tried) {
      load(settled, false)
      return
    }
    // A setter or an update handler can throw. Nothing was written then, so
    // the bookkeeping and the fields go back to what they were before the
    // error leaves. Reloading the settled value instead would empty a
    // half-entered time, which the value cannot carry.
    settled = next
    tried = next
    turns++
    open = true
    try {
      value.value = next
    } catch (error) {
      restore(from)
      throw error
    }

    if (value.value === next) open = false
    else sent.value++
  }

  function load (raw: unknown, warn = true) {
    const parsed = isString(raw) ? parseTime(raw) : null
    if (isNull(parsed)) {
      if (__DEV__ && warn && !isNullOrUndefined(raw) && raw !== '') {
        logger.warn(`createTimePicker: value ${JSON.stringify(raw)} is not a 24-hour HH:mm or HH:mm:ss time; the fields were emptied`)
      }
      hour24.value = null
      minute.value = null
      stored.value = null
      pending.value = 'am'
      return
    }

    hour24.value = parsed.hour
    minute.value = parsed.minute
    stored.value = parsed.second ?? 0
    pending.value = meridiem(parsed.hour)
  }

  // Opens a pass: whatever was waiting for it counts as applied from here.
  // Seconds that just turned on start at 0 for a time that was complete
  // without them. Seconds that are off are dropped, but not while blocked,
  // where the incoming value is kept as given.
  function settle () {
    const entered = seconds.value && !timed
    timed = seconds.value
    fresh = false
    seen = mark()

    if (!seconds.value) {
      if (!blocked()) stored.value = null
    } else if (entered && isNull(stored.value) && !isNull(hour24.value) && !isNull(minute.value)) {
      stored.value = 0
    }
  }

  function begin () {
    turns = 0
    tried = undefined
  }

  function mark (): string {
    return [
      seconds.value,
      blocked(),
      hourCycle.value,
      toValue(min) ?? null,
      toValue(max) ?? null,
      toValue(hourStep),
      toValue(minuteStep),
      toValue(secondStep),
    ].join('\n')
  }

  function normalize () {
    settle()
    if (!blocked()) publish()
  }

  // The owner did not take the last write, so the model has the last word:
  // its value goes into the fields as given and nothing is written back.
  // It was warned about when it first came in.
  function adopt () {
    const held = value.value
    if (held === settled) return
    settled = held
    load(held, false)
  }

  // A value or option that changed in this tick is still waiting for the
  // pass. Applying it first gives an edit the same result as one made a
  // tick later.
  function drain () {
    settle()
    fit()
  }

  function assign (part: TimePart, next: number | TimePeriod | null): boolean {
    if (part === 'period') {
      if (hourCycle.value !== 'h12') return false
      if (next !== 'am' && next !== 'pm') return false
      if (period.value === next) return false

      pending.value = next
      // `fit` sets the grid aside in a range with no on-grid time, so the
      // hour is snapped into its new half here, as a numeric commit does.
      if (!isNull(hour24.value)) hour24.value = nearest(hours(next), to24(displayHour(hour24.value), next))
      return true
    }

    if (part === 'second' && !seconds.value) return false

    if (isNull(next)) {
      if (part === 'hour') {
        if (isNull(hour24.value)) return false
        pending.value = meridiem(hour24.value)
        hour24.value = null
      } else if (part === 'minute') {
        if (isNull(minute.value)) return false
        minute.value = null
      } else {
        if (isNull(stored.value)) return false
        stored.value = null
      }
      return true
    }

    if (!isNumber(next) || !Number.isFinite(next)) return false

    if (part === 'hour') {
      if (hourCycle.value === 'h12') {
        const half = period.value === 'pm' ? 'pm' : 'am'
        hour24.value = nearest(hours(half), to24(clamp(next, 1, 12), half))
      } else {
        hour24.value = nearest(hours('am'), next)
      }
    } else if (part === 'minute') {
      minute.value = nearest(sixty('minute'), next)
    } else {
      stored.value = nearest(sixty('second'), next)
    }
    return true
  }

  function shift (part: TimePart, count: number): boolean {
    const moves = Number.isFinite(count) ? Math.trunc(count) : 0
    if (moves === 0) return false

    if (part === 'period') return assign('period', period.value === 'pm' ? 'am' : 'pm')

    if (part === 'hour') {
      const list = hours(period.value === 'pm' ? 'pm' : 'am')
      hour24.value = isNull(hour24.value) ? list[0]! : travel(list, hour24.value, moves)
      return true
    }

    if (part === 'second' && !seconds.value) return false

    const field = part === 'minute' ? minute : stored
    const list = sixty(part)
    field.value = isNull(field.value) ? list[0]! : travel(list, field.value, moves)
    return true
  }

  // An edit works on what the fields show. A value they took as given is
  // their settled state, so it is not normalized first; only a change still
  // waiting for the pass is. A call that changes nothing writes nothing,
  // unless such a change was waiting, which is then published.
  function edit (change: () => boolean) {
    if (blocked()) return

    const from = snapshot()
    const due = fresh || mark() !== seen
    if (due) drain()
    if (!change() && !due) return

    begin()
    publish(from)
  }

  function commit (part: TimeUnit, next: number | null): void
  function commit (part: 'period', next: TimePeriod): void
  function commit (part: TimePart, next: number | TimePeriod | null): void {
    edit(() => assign(part, next))
  }

  function step (part: TimePart, count = 1) {
    edit(() => shift(part, count))
  }

  function clear () {
    if (blocked()) return
    const from = snapshot()
    begin()
    hour24.value = null
    minute.value = null
    stored.value = null
    pending.value = 'am'
    publish(from)
  }

  function grid (part: TimeUnit): TimeGrid {
    if (part !== 'hour') {
      const list = sixty(part)
      return { min: list[0]!, max: list.at(-1)!, step: stride(part) }
    }

    const shown = hours(period.value === 'pm' ? 'pm' : 'am')
      .map(point => hourCycle.value === 'h12' ? displayHour(point) : point)
    return { min: Math.min(...shown), max: Math.max(...shown), step: stride('hour') }
  }

  // The picker's own write coming back is `settled` and is skipped, so
  // fields the value cannot carry while it is partial survive the echo.
  watch(value, next => {
    if (next === settled) return
    settled = next
    load(next)
    if (open && turns > 1) return
    if (!open) begin()
    fresh = true
    stale.value++
  }, { flush: 'sync' })

  // A parent can change the model and an option in one render, and Vue
  // hands the props over one at a time. Normalizing before the flush keeps
  // a half-applied batch from being written over the incoming value.
  watch(
    () => [mark(), stale.value] as const,
    (next, previous) => {
      // An option that changed and changed back leaves nothing to apply,
      // and must not normalize a value the fields took as given.
      if (!fresh && next[0] === seen) return
      if (next[1] === previous[1]) begin()
      normalize()
    },
    { flush: 'pre' },
  )

  // The deferred check must not touch the fields of a picker that is gone.
  onScopeDispose(() => {
    live = false
  }, true)

  // The owner answers in its own queued work, which on a top-level mount
  // runs after this component's post flush. Waiting one more tick keeps an
  // accepted write from being read as a refusal. A check that a later write
  // has overtaken stands down: that write's answer is not in yet, and its
  // own check follows.
  watch(sent, ticket => {
    void nextTick(() => {
      if (ticket !== sent.value) return
      open = false
      if (live) adopt()
    })
  }, { flush: 'post' })

  if (__DEV__) {
    watch(
      () => [toValue(min) ?? null, toValue(max) ?? null] as const,
      ([low, high]) => {
        for (const [name, raw] of [['min', low], ['max', high]] as const) {
          if (isNull(raw) || raw === '' || !isNull(boundSeconds(raw))) continue
          logger.warn(`createTimePicker: ${name} ${JSON.stringify(raw)} is not a 24-hour HH:mm or HH:mm:ss time; the bound is ignored`)
        }

        const from = boundSeconds(low)
        const to = boundSeconds(high)
        if (!isNull(from) && !isNull(to) && from > to) {
          logger.warn(`createTimePicker: min ${JSON.stringify(low)} is after max ${JSON.stringify(high)}; the range is ignored`)
        }
      },
      { flush: 'sync', immediate: true },
    )
  }

  settled = value.value
  load(value.value)
  normalize()

  return {
    value,
    hour,
    minute,
    second,
    period,
    hourCycle,
    seconds,
    isDisabled,
    isReadonly,
    display,
    commit,
    step,
    clear,
    grid,
  }
}
