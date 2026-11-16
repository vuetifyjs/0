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
 * complete value that falls outside `min` / `max` clamps to that bound.
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
import { effectScope, shallowRef, toRef, toValue, watch } from 'vue'

// Types
import type { MaybeRefOrGetter, Ref } from 'vue'

export type TimeHourCycle = 'h12' | 'h23'

export type TimePeriod = 'am' | 'pm'

/** One segment of the time value. */
export type TimePart = 'hour' | 'minute' | 'second' | 'period'

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
   * the step grid, clamped into `min` / `max`, and written back in canonical
   * form. With `seconds` on, `HH:mm` reads as second `0`; with it off,
   * `HH:mm:ss` drops the seconds. An unparseable value empties the fields
   * and becomes `null`.
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
  hourCycle?: MaybeRefOrGetter<TimeHourCycle>
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
  hourStep?: MaybeRefOrGetter<number>
  /**
   * Minute interval. The minute moves on the multiples of the step inside
   * `0`–`59`. Fractions truncate, and a non-finite or non-positive step is
   * read as `1`. A step above `59` leaves `0` as the only minute.
   *
   * @default 1
   */
  minuteStep?: MaybeRefOrGetter<number>
  /**
   * Second interval. Same rules as `minuteStep`.
   *
   * @default 1
   */
  secondStep?: MaybeRefOrGetter<number>
  /**
   * Inclusive lower bound, `HH:mm` or `HH:mm:ss`. Applies to a complete
   * value only, and wins over the step grid. An unparseable bound, or a
   * `min` above `max`, turns clamping off.
   */
  min?: MaybeRefOrGetter<string | null>
  /**
   * Inclusive upper bound, `HH:mm` or `HH:mm:ss`. Applies to a complete
   * value only, and wins over the step grid. An unparseable bound, or a
   * `max` below `min`, turns clamping off.
   */
  max?: MaybeRefOrGetter<string | null>
  /**
   * While true, `commit`, `step`, and `clear` do nothing and the picker
   * never writes `value`: an incoming value is shown as given, without
   * snapping or clamping. Turning it off normalizes the value.
   */
  disabled?: MaybeRefOrGetter<boolean>
  /**
   * While true, `commit`, `step`, and `clear` do nothing and the picker
   * never writes `value`: an incoming value is shown as given, without
   * snapping or clamping. Turning it off normalizes the value.
   */
  readonly?: MaybeRefOrGetter<boolean>
}

export interface TimePickerContext {
  /**
   * Canonical 24-hour value, or `null` while a field is still empty.
   * Writing it from outside replaces every field. The picker writes it on
   * every edit, and never while disabled or readonly.
   *
   * @example
   * ```ts
   * const time = createTimePicker({ seconds: true })
   * time.value.value = '09:30'
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
   * meridiem: the last one committed, or the one the hour had when it was
   * cleared.
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
   * `null`. A number is rounded, held inside the field's range, and snapped
   * to the nearest grid point without wrapping. In `h12` the hour is read
   * as a display hour in the current meridiem. A period commit moves a set
   * hour to the other half of the day, and is remembered while the hour is
   * empty. No-op for `period` in `h23`, for `second` while seconds are off,
   * and for a non-finite number.
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
  commit: {
    (part: 'hour' | 'minute' | 'second', value: number | null): void
    (part: 'period', value: TimePeriod): void
  }
  /**
   * Move one field along its grid. The sign of `count` is the direction and
   * its magnitude the number of intervals; it defaults to `1`, fractions
   * truncate, and `0` or a non-finite count does nothing. The field wraps
   * past either end, and a value off the grid first moves onto the adjacent
   * grid point. An `h12` hour stays inside its meridiem. An empty field
   * lands on its first grid point, `0`, or `12` for an `h12` hour, whatever
   * the count. Any non-zero count flips the period.
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
  grid: (part: 'hour' | 'minute' | 'second') => TimeGrid
}

interface ParsedTime {
  hour: number
  minute: number
  second: number | null
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
  const second = shallowRef<number | null>(null)
  const pending = shallowRef<TimePeriod>('am')

  let writing = false

  const hourCycle = toRef((): TimeHourCycle => toValue(_hourCycle) === 'h12' ? 'h12' : 'h23')
  const seconds = toRef(() => Boolean(toValue(_seconds)))
  const isDisabled = toRef(() => Boolean(toValue(disabled)))
  const isReadonly = toRef(() => Boolean(toValue(_readonly)))

  const hour = toRef((): number | null => {
    if (isNull(hour24.value)) return null
    return hourCycle.value === 'h12' ? displayHour(hour24.value) : hour24.value
  })

  const period = toRef((): TimePeriod | null => {
    if (hourCycle.value !== 'h12') return null
    if (isNull(hour24.value)) return pending.value
    return meridiem(hour24.value)
  })

  function blocked (): boolean {
    return isDisabled.value || isReadonly.value
  }

  function hours (half: TimePeriod): number[] {
    const step = interval(toValue(hourStep))
    if (hourCycle.value !== 'h12') return points(0, 23, step)
    return half === 'pm' ? points(12, 23, step) : points(0, 11, step)
  }

  function sixty (part: 'minute' | 'second'): number[] {
    return points(0, 59, interval(toValue(part === 'minute' ? minuteStep : secondStep)))
  }

  function snap () {
    if (!isNull(hour24.value)) hour24.value = nearest(hours(meridiem(hour24.value)), hour24.value)
    if (!isNull(minute.value)) minute.value = nearest(sixty('minute'), minute.value)
    if (!isNull(second.value)) second.value = nearest(sixty('second'), second.value)
  }

  function boundSeconds (raw: string | null): number | null {
    if (!isString(raw)) return null
    const parsed = parseTime(raw)
    if (isNull(parsed)) return null
    const secondPart = seconds.value ? (parsed.second ?? 0) : 0
    return parsed.hour * 3600 + parsed.minute * 60 + secondPart
  }

  function applyBound (total: number) {
    hour24.value = Math.floor(total / 3600)
    minute.value = Math.floor((total % 3600) / 60)
    if (seconds.value) second.value = total % 60
  }

  function clampToRange () {
    if (isNull(hour24.value) || isNull(minute.value)) return
    if (seconds.value && isNull(second.value)) return

    const current = hour24.value * 3600 + minute.value * 60 + (seconds.value ? second.value ?? 0 : 0)
    const low = boundSeconds(toValue(min) ?? null)
    const high = boundSeconds(toValue(max) ?? null)
    if (!isNull(low) && !isNull(high) && low > high) return
    if (!isNull(low) && current < low) applyBound(low)
    else if (!isNull(high) && current > high) applyBound(high)
  }

  function format (): string | null {
    if (isNull(hour24.value) || isNull(minute.value)) return null
    if (seconds.value && isNull(second.value)) return null

    const text = `${pad(hour24.value)}:${pad(minute.value)}`
    if (!seconds.value) return text
    return `${text}:${pad(second.value ?? 0)}`
  }

  function publish () {
    if (blocked()) return
    clampToRange()
    const next = format()
    if (value.value === next) return
    writing = true
    value.value = next
    writing = false
  }

  function load (raw: unknown) {
    if (isNullOrUndefined(raw) || raw === '') {
      hour24.value = null
      minute.value = null
      second.value = null
      pending.value = 'am'
      return
    }

    const parsed = isString(raw) ? parseTime(raw) : null
    if (isNull(parsed)) {
      if (__DEV__) {
        logger.warn(`createTimePicker: value ${JSON.stringify(raw)} is not a 24-hour HH:mm or HH:mm:ss time; the fields were emptied`)
      }
      hour24.value = null
      minute.value = null
      second.value = null
      return
    }

    hour24.value = parsed.hour
    minute.value = parsed.minute
    second.value = seconds.value ? parsed.second ?? 0 : null
    pending.value = meridiem(parsed.hour)
    if (!blocked()) snap()
  }

  function commit (part: 'hour' | 'minute' | 'second', next: number | null): void
  function commit (part: 'period', next: TimePeriod): void
  function commit (part: TimePart, next: number | TimePeriod | null): void {
    if (blocked()) return

    if (part === 'period') {
      if (hourCycle.value !== 'h12') return
      if (next !== 'am' && next !== 'pm') return
      pending.value = next
      if (isNull(hour24.value)) return
      hour24.value = nearest(hours(next), to24(displayHour(hour24.value), next))
      publish()
      return
    }

    if (part === 'second' && !seconds.value) return

    if (isNull(next)) {
      if (part === 'hour') {
        if (!isNull(hour24.value)) pending.value = meridiem(hour24.value)
        hour24.value = null
      } else if (part === 'minute') {
        minute.value = null
      } else {
        second.value = null
      }
      publish()
      return
    }

    if (!isNumber(next) || !Number.isFinite(next)) return

    if (part === 'hour') {
      if (hourCycle.value === 'h12') {
        const half = period.value === 'pm' ? 'pm' : 'am'
        hour24.value = nearest(hours(half), to24(clamp(Math.round(next), 1, 12), half))
      } else {
        hour24.value = nearest(hours('am'), next)
      }
    } else if (part === 'minute') {
      minute.value = nearest(sixty('minute'), next)
    } else {
      second.value = nearest(sixty('second'), next)
    }
    publish()
  }

  function step (part: TimePart, count = 1) {
    if (blocked()) return
    const moves = Number.isFinite(count) ? Math.trunc(count) : 0
    if (moves === 0) return

    if (part === 'period') {
      if (hourCycle.value !== 'h12') return
      commit('period', period.value === 'pm' ? 'am' : 'pm')
      return
    }

    if (part === 'hour') {
      const list = hours(period.value === 'pm' ? 'pm' : 'am')
      hour24.value = isNull(hour24.value) ? list[0]! : travel(list, hour24.value, moves)
      publish()
      return
    }

    if (part === 'second' && !seconds.value) return

    const field = part === 'minute' ? minute : second
    const list = sixty(part)
    field.value = isNull(field.value) ? list[0]! : travel(list, field.value, moves)
    publish()
  }

  function clear () {
    if (blocked()) return
    hour24.value = null
    minute.value = null
    second.value = null
    pending.value = 'am'
    publish()
  }

  function grid (part: 'hour' | 'minute' | 'second'): TimeGrid {
    if (part !== 'hour') {
      const list = sixty(part)
      return { min: list[0]!, max: list.at(-1)!, step: interval(toValue(part === 'minute' ? minuteStep : secondStep)) }
    }

    const shown = hours(period.value === 'pm' ? 'pm' : 'am')
      .map(point => hourCycle.value === 'h12' ? displayHour(point) : point)
    return { min: Math.min(...shown), max: Math.max(...shown), step: interval(toValue(hourStep)) }
  }

  const scope = effectScope()
  scope.run(() => {
    // A controlled v-model hands the picker's own output back after the write
    // has finished. Re-reading it would drop fields the value cannot carry
    // while it is still partial.
    watch(value, next => {
      if (writing || next === format()) return
      load(next)
      publish()
    }, { flush: 'sync' })

    watch(
      () => [
        seconds.value,
        hourCycle.value,
        toValue(min) ?? null,
        toValue(max) ?? null,
        toValue(hourStep),
        toValue(minuteStep),
        toValue(secondStep),
      ] as const,
      (next, previous) => {
        if (!next[0]) {
          second.value = null
        } else if (!previous[0] && isNull(second.value) && !isNull(hour24.value) && !isNull(minute.value)) {
          second.value = 0
        }
        if (blocked()) return
        snap()
        publish()
      },
      { flush: 'sync' },
    )

    watch(blocked, next => {
      if (next) return
      snap()
      publish()
    }, { flush: 'sync' })

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

    load(value.value)
    publish()
  })

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
    commit,
    step,
    clear,
    grid,
  }
}
