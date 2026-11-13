/**
 * @module createTimePicker
 *
 * @see https://0.vuetifyjs.com/composables/forms/create-time-picker
 *
 * @remarks
 * Segmented time value. Hour, minute, and optional second stay in separate
 * fields. The public value is a 24-hour `HH:mm` or `HH:mm:ss` string, and it
 * stays `null` until every enabled field is set. `h12` keeps a meridiem and
 * still stores the canonical hour in 24-hour form. Step snapping uses
 * `createNumeric`. A complete value that falls outside `min` / `max` clamps
 * to that bound.
 *
 * Does not read the DOM or `window`. Pass `hourCycle` from `useDate` when a
 * date adapter is installed; this factory does not call it.
 *
 * @example
 * ```ts
 * import { shallowRef } from 'vue'
 * import { createTimePicker } from '@vuetify/v0'
 *
 * const value = shallowRef<string | null>(null)
 * const time = createTimePicker({ value, hourCycle: 'h12' })
 *
 * time.setHour(3)
 * time.setMinute(30)
 * time.setPeriod('pm')
 * time.value.value // '15:30'
 * ```
 */

// Composables
import { createNumeric } from '#v0/composables/createNumeric'

// Utilities
import { clamp, isNull, isNumber, isString, isUndefined } from '#v0/utilities'
import { effectScope, shallowRef, toRef, toValue, watch } from 'vue'

// Types
import type { MaybeRefOrGetter, Ref } from 'vue'

export type TimeHourCycle = 'h12' | 'h23'

export type TimePeriod = 'am' | 'pm'

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
  /** Canonical `HH:mm` or `HH:mm:ss` source. @default shallowRef(null) */
  value?: Ref<string | null>
  /**
   * `h12` shows 1–12 and a meridiem. `h23` shows 0–23.
   * Any other value is read as `h23`.
   *
   * @default 'h23'
   */
  hourCycle?: MaybeRefOrGetter<TimeHourCycle>
  /** Include seconds in the canonical value. @default false */
  seconds?: MaybeRefOrGetter<boolean>
  /** Hour snap interval. @default 1 */
  hourStep?: MaybeRefOrGetter<number>
  /** Minute snap interval. @default 1 */
  minuteStep?: MaybeRefOrGetter<number>
  /** Second snap interval. @default 1 */
  secondStep?: MaybeRefOrGetter<number>
  /** Inclusive lower bound, `HH:mm` or `HH:mm:ss`. */
  min?: MaybeRefOrGetter<string | null>
  /** Inclusive upper bound, `HH:mm` or `HH:mm:ss`. */
  max?: MaybeRefOrGetter<string | null>
  /** Ignore mutations while true. */
  disabled?: MaybeRefOrGetter<boolean>
  /** Ignore mutations while true. */
  readonly?: MaybeRefOrGetter<boolean>
}

export interface TimePickerContext {
  /** Canonical 24-hour value, or `null` while a field is still empty. */
  readonly value: Ref<string | null>
  /**
   * Field hour. `0`–`23` in `h23`, `1`–`12` in `h12`. `null` when unset.
   *
   * @example
   * ```ts
   * const time = createTimePicker({ hourCycle: 'h12' })
   * time.setHour(3)
   * time.setMinute(0)
   * time.hour.value // 3
   * ```
   */
  readonly hour: Readonly<Ref<number | null>>
  /** Minute field, `0`–`59`, or `null` when unset. */
  readonly minute: Readonly<Ref<number | null>>
  /** Second field, or `null` when seconds are off or unset. */
  readonly second: Readonly<Ref<number | null>>
  /**
   * Meridiem. `null` in `h23`. In `h12`, the pending meridiem before an hour is set.
   *
   * @example
   * ```ts
   * const time = createTimePicker({ hourCycle: 'h12' })
   * time.setHour(3)
   * time.setMinute(0)
   * time.setPeriod('pm')
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
   * Set the displayed hour, snapped to `hourStep`. `null` clears it.
   * In `h12` the number is `1`–`12` and combines with the current period.
   */
  setHour: (hour: number | null) => void
  /** Set the minute, snapped to `minuteStep`. `null` clears it. */
  setMinute: (minute: number | null) => void
  /**
   * Set the second, snapped to `secondStep`. No-op while seconds are off.
   * `null` clears it.
   */
  setSecond: (second: number | null) => void
  /**
   * Set the meridiem. No-op in `h23`. With an hour already set, this shifts
   * that hour by 12. Without one, it is remembered for the next `setHour`.
   */
  setPeriod: (period: TimePeriod) => void
  /**
   * Step the hour by one `hourStep`. Wraps inside `0`–`23` or `1`–`12`.
   * The first step from empty lands on `0` or `12`.
   *
   * @example
   * ```ts
   * const time = createTimePicker()
   * time.setHour(23)
   * time.setMinute(0)
   * time.stepHour(1)
   * time.value.value // '00:00'
   * ```
   */
  stepHour: (direction: number) => void
  /** Step the minute. Wraps inside `0`–`59`. The first step from empty lands on `0`. */
  stepMinute: (direction: number) => void
  /** Step the second. No-op while seconds are off. */
  stepSecond: (direction: number) => void
  /** Clear every field. The value becomes `null`. */
  clear: () => void
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

function safeStep (step: number): number {
  return Number.isFinite(step) && step > 0 ? step : 1
}

function snapUnit (value: number, min: number, max: number, step: number): number {
  const snapped = createNumeric({ min, max, step: safeStep(step) }).snap(value)
  return clamp(Math.round(snapped), min, max)
}

function stepped (current: number, min: number, max: number, step: number, sign: number): number {
  const numeric = createNumeric({ min, max, step: safeStep(step), wrap: true })
  const next = sign > 0 ? numeric.up(current) : numeric.down(current)
  return clamp(Math.round(next), min, max)
}

function signOf (direction: number): number {
  if (!Number.isFinite(direction)) return 0
  return Math.sign(direction)
}

export function createTimePicker (options: TimePickerOptions = {}): TimePickerContext {
  const {
    value = shallowRef<string | null>(null),
    hourCycle: cycle = 'h23',
    seconds: secondsOption = false,
    hourStep = 1,
    minuteStep = 1,
    secondStep = 1,
    min = null,
    max = null,
    disabled = false,
    readonly: readOnly = false,
  } = options

  const hour24 = shallowRef<number | null>(null)
  const minute = shallowRef<number | null>(null)
  const second = shallowRef<number | null>(null)
  const pending = shallowRef<TimePeriod>('am')

  let writing = false

  const hourCycle = toRef((): TimeHourCycle => toValue(cycle) === 'h12' ? 'h12' : 'h23')
  const seconds = toRef(() => Boolean(toValue(secondsOption)))
  const isDisabled = toRef(() => Boolean(toValue(disabled)))
  const isReadonly = toRef(() => Boolean(toValue(readOnly)))

  const hour = toRef((): number | null => {
    if (isNull(hour24.value)) return null
    return hourCycle.value === 'h12' ? displayHour(hour24.value) : hour24.value
  })

  const period = toRef((): TimePeriod | null => {
    if (hourCycle.value !== 'h12') return null
    if (isNull(hour24.value)) return pending.value
    return hour24.value >= 12 ? 'pm' : 'am'
  })

  function blocked (): boolean {
    return isDisabled.value || isReadonly.value
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
    clampToRange()
    const next = format()
    if (value.value === next) return
    writing = true
    value.value = next
    writing = false
  }

  function ingest (raw: string | null) {
    if (!isString(raw) || raw.length === 0) {
      hour24.value = null
      minute.value = null
      second.value = null
      pending.value = 'am'
      return
    }

    const parsed = parseTime(raw)
    if (isNull(parsed)) {
      hour24.value = null
      minute.value = null
      second.value = null
      return
    }

    hour24.value = snapUnit(parsed.hour, 0, 23, toValue(hourStep))
    minute.value = snapUnit(parsed.minute, 0, 59, toValue(minuteStep))
    second.value = seconds.value && !isNull(parsed.second)
      ? snapUnit(parsed.second, 0, 59, toValue(secondStep))
      : null
    if (hourCycle.value === 'h12' && !isNull(hour24.value)) {
      pending.value = hour24.value >= 12 ? 'pm' : 'am'
    }
  }

  function resnap () {
    if (!isNull(hour24.value)) hour24.value = snapUnit(hour24.value, 0, 23, toValue(hourStep))
    if (!isNull(minute.value)) minute.value = snapUnit(minute.value, 0, 59, toValue(minuteStep))
    if (seconds.value) {
      if (!isNull(second.value)) second.value = snapUnit(second.value, 0, 59, toValue(secondStep))
    } else {
      second.value = null
    }
  }

  function setHour (next: number | null) {
    if (blocked()) return
    if (isNull(next)) {
      hour24.value = null
      publish()
      return
    }
    if (!isNumber(next) || !Number.isFinite(next)) return

    if (hourCycle.value === 'h12') {
      const display = snapUnit(next, 1, 12, toValue(hourStep))
      const meridiem = period.value === 'pm' ? 'pm' : 'am'
      hour24.value = to24(display, meridiem)
    } else {
      hour24.value = snapUnit(next, 0, 23, toValue(hourStep))
    }
    publish()
  }

  function setMinute (next: number | null) {
    if (blocked()) return
    if (isNull(next)) {
      minute.value = null
      publish()
      return
    }
    if (!isNumber(next) || !Number.isFinite(next)) return
    minute.value = snapUnit(next, 0, 59, toValue(minuteStep))
    publish()
  }

  function setSecond (next: number | null) {
    if (blocked() || !seconds.value) return
    if (isNull(next)) {
      second.value = null
      publish()
      return
    }
    if (!isNumber(next) || !Number.isFinite(next)) return
    second.value = snapUnit(next, 0, 59, toValue(secondStep))
    publish()
  }

  function setPeriod (next: TimePeriod) {
    if (blocked() || hourCycle.value !== 'h12') return
    if (next !== 'am' && next !== 'pm') return
    if (isNull(hour24.value)) {
      pending.value = next
      return
    }
    hour24.value = to24(displayHour(hour24.value), next)
    publish()
  }

  function stepHour (direction: number) {
    if (blocked()) return
    const sign = signOf(direction)
    if (sign === 0) return

    const step = toValue(hourStep)
    if (hourCycle.value === 'h12') {
      const meridiem = period.value === 'pm' ? 'pm' : 'am'
      const display = isNull(hour24.value)
        ? snapUnit(12, 1, 12, step)
        : stepped(displayHour(hour24.value), 1, 12, step, sign)
      hour24.value = to24(display, meridiem)
    } else {
      hour24.value = isNull(hour24.value)
        ? snapUnit(0, 0, 23, step)
        : stepped(hour24.value, 0, 23, step, sign)
    }
    publish()
  }

  function stepMinute (direction: number) {
    if (blocked()) return
    const sign = signOf(direction)
    if (sign === 0) return

    const step = toValue(minuteStep)
    minute.value = isNull(minute.value)
      ? snapUnit(0, 0, 59, step)
      : stepped(minute.value, 0, 59, step, sign)
    publish()
  }

  function stepSecond (direction: number) {
    if (blocked() || !seconds.value) return
    const sign = signOf(direction)
    if (sign === 0) return

    const step = toValue(secondStep)
    second.value = isNull(second.value)
      ? snapUnit(0, 0, 59, step)
      : stepped(second.value, 0, 59, step, sign)
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

  const scope = effectScope()
  scope.run(() => {
    watch(value, next => {
      if (writing) return
      ingest(next)
      publish()
    }, { flush: 'sync' })

    watch(
      () => [
        toValue(min) ?? null,
        toValue(max) ?? null,
        seconds.value,
        toValue(hourStep),
        toValue(minuteStep),
        toValue(secondStep),
      ] as const,
      () => {
        resnap()
        publish()
      },
      { flush: 'sync' },
    )

    ingest(value.value)
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
    setHour,
    setMinute,
    setSecond,
    setPeriod,
    stepHour,
    stepMinute,
    stepSecond,
    clear,
  }
}
