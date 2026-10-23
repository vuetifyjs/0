/**
 * @module useClock
 *
 * @see https://0.vuetifyjs.com/systems/md1/time-picker
 *
 * @remarks
 * Headless state for the Material Design 1 time picker. v0's
 * `createTimePicker` is a draft with no source, so Material Design 1 owns this core
 * (SPEC.md, Deviations) until it graduates: the composable holds the time,
 * the hour or minute view, the 12 or 24 hour format and the clock geometry
 * (ring positions and the hand angle) and never touches the DOM. `Md1TimePicker`
 * renders the face, binds the pointer and keyboard events and writes the model.
 *
 * Key features:
 * - One canonical time (`hour` 0 to 23, `minute` 0 to 59) behind both formats;
 *   the period is derived, and selecting a ring value maps through the format
 * - The ring for the current view: 12, 1 to 11 in 12 hour mode; the same
 *   outer ring plus an inner 00, 13 to 23 ring in 24 hour mode (the spec names
 *   the mode and does not draw it); every minute in the minute view, labelled
 *   on the fives
 * - `pick(angle, inner)` turns a pointer angle into the nearest ring value, so
 *   the face can be tapped or dragged anywhere, not only on a label
 *
 * @example
 * ```ts
 * import { useClock } from '@paper/md1'
 *
 * const clock = useClock({ value: () => props.modelValue, format: () => props.format })
 *
 * clock.selectHour(3)
 * clock.advance()
 * clock.selectMinute(30)
 * clock.value.value // "03:30"
 * ```
 */

// Framework
import { isString } from '@vuetify/v0'

// Utilities
import { shallowRef, toRef, toValue, watch } from 'vue'

// Types
import type { MaybeRefOrGetter, Ref } from 'vue'

export type ClockFormat = '12' | '24'
export type ClockView = 'hour' | 'minute'
export type ClockPeriod = 'am' | 'pm'
export type ClockRing = 'outer' | 'inner'

export interface ClockTime {
  /** 0 to 23. */
  hour: number
  /** 0 to 59. */
  minute: number
}

export interface ClockNumber {
  /** The ring value: the hour as the ring prints it (1 to 12, or 0 to 23), or the minute. */
  value: number
  /** Printed label: `12`, `1`, `00`, `05`. */
  label: string
  /** Degrees clockwise from twelve o'clock. */
  angle: number
  /** The inner ring exists only in 24 hour mode, for 00 and 13 to 23. */
  ring: ClockRing
  /** Printed on the face: every hour, every fifth minute. */
  labelled: boolean
}

export interface ClockOptions {
  /** `HH:mm`. Applied whenever it changes and parses; `undefined` or an invalid string leaves the face where it is. */
  value?: MaybeRefOrGetter<string | undefined>
  /** `12` (default) or `24`. */
  format?: MaybeRefOrGetter<ClockFormat | undefined>
}

export interface ClockContext {
  /** 0 to 23, whatever the format. */
  readonly hour: Readonly<Ref<number>>
  /** 0 to 59. */
  readonly minute: Readonly<Ref<number>>
  /** Derived from `hour`; `am` below twelve. */
  readonly period: Readonly<Ref<ClockPeriod>>
  /** The ring on the face. Writable: the header toggles bind it. */
  readonly view: Ref<ClockView>
  readonly format: Readonly<Ref<ClockFormat>>
  /** `HH:mm`, zero padded, 24 hour. */
  readonly value: Readonly<Ref<string>>
  /** Header digits for the hour: `3` in 12 hour mode, `15` or `09` in 24 hour mode. */
  readonly hours: Readonly<Ref<string>>
  /** Header digits for the minute, zero padded. */
  readonly minutes: Readonly<Ref<string>>
  /** The ring of the current view, in arrow-key order. */
  readonly numbers: Readonly<Ref<readonly ClockNumber[]>>
  /** The ring value of the current view that is selected. */
  readonly selected: Readonly<Ref<number>>
  /** Hand angle in degrees clockwise from twelve o'clock. */
  readonly angle: Readonly<Ref<number>>
  /** The ring the hand ends on. */
  readonly ring: Readonly<Ref<ClockRing>>
  /**
   * Selects an hour by its ring value: 1 to 12 in 12 hour mode (mapped through
   * the current period), 0 to 23 in 24 hour mode. Out-of-range values are ignored.
   *
   * @example
   * ```ts
   * clock.selectPeriod('pm')
   * clock.selectHour(3)
   * clock.hour.value // 15
   * ```
   */
  selectHour: (value: number) => void
  /** Selects a minute, 0 to 59. Out-of-range values are ignored. */
  selectMinute: (value: number) => void
  /** Moves the hour into the other half of the day, keeping the ring value. */
  selectPeriod: (period: ClockPeriod) => void
  /**
   * The ring value nearest an angle in the current view. `inner` picks the
   * inner ring in 24 hour mode and is ignored otherwise.
   *
   * @example
   * ```ts
   * clock.pick(90) // 3 in the hour view, 15 in the minute view
   * ```
   */
  pick: (angle: number, inner?: boolean) => number
  /** Hour view to minute view; the step the spec takes after an hour is chosen. No-op in the minute view. */
  advance: () => void
  /** Sets the canonical time. */
  set: (time: ClockTime) => void
}

const TIME = /^(\d{1,2}):(\d{2})$/

/**
 * Parses `HH:mm` (or `H:mm`) on a 24 hour clock. Anything else, including
 * seconds, an out-of-range field or a non-string, yields `undefined`.
 */
export function parseTime (value: unknown): ClockTime | undefined {
  if (!isString(value)) return undefined

  const match = TIME.exec(value.trim())

  if (!match) return undefined

  const hour = Number(match[1])
  const minute = Number(match[2])

  if (hour > 23 || minute > 59) return undefined

  return { hour, minute }
}

function pad (value: number): string {
  return String(value).padStart(2, '0')
}

/** `HH:mm`, zero padded, 24 hour. */
export function formatTime (time: ClockTime): string {
  return `${pad(time.hour)}:${pad(time.minute)}`
}

function normalize (angle: number): number {
  return ((angle % 360) + 360) % 360
}

function inner (hour: number): boolean {
  return hour === 0 || hour >= 13
}

/** 12 at the top, then 1 to 11 clockwise: the order the arrow keys walk. */
const TWELVE: readonly ClockNumber[] = Array.from({ length: 12 }, (_, index): ClockNumber => {
  const value = index === 0 ? 12 : index

  return { value, label: String(value), angle: index * 30, ring: 'outer', labelled: true }
})

/** 0 to 23 in day order; 00 and 13 to 23 sit on the inner ring under 12 and 1 to 11. */
const TWENTY_FOUR: readonly ClockNumber[] = Array.from({ length: 24 }, (_, hour): ClockNumber => ({
  value: hour,
  label: inner(hour) ? pad(hour) : String(hour),
  angle: (hour % 12) * 30,
  ring: inner(hour) ? 'inner' : 'outer',
  labelled: true,
}))

/** Every minute, so the keyboard reaches 37; printed on the fives like the spec's face. */
const SIXTY: readonly ClockNumber[] = Array.from({ length: 60 }, (_, minute): ClockNumber => ({
  value: minute,
  label: pad(minute),
  angle: minute * 6,
  ring: 'outer',
  labelled: minute % 5 === 0,
}))

/**
 * Creates the time and clock state behind `Md1TimePicker`.
 *
 * @param options Reactive `value` and `format`.
 * @returns A `ClockContext`.
 *
 * @see https://0.vuetifyjs.com/systems/md1/time-picker
 *
 * @example
 * ```ts
 * const clock = useClock({ value: '15:30' })
 *
 * clock.hours.value // "3"
 * clock.period.value // "pm"
 * clock.angle.value // 90
 * ```
 */
export function useClock (options: ClockOptions = {}): ClockContext {
  const hour = shallowRef(0)
  const minute = shallowRef(0)
  const view = shallowRef<ClockView>('hour')

  const format = toRef((): ClockFormat => toValue(options.format) ?? '12')
  const period = toRef((): ClockPeriod => hour.value < 12 ? 'am' : 'pm')
  const value = toRef(() => formatTime({ hour: hour.value, minute: minute.value }))

  const hours = toRef(() => format.value === '12' ? String(hour.value % 12 || 12) : pad(hour.value))
  const minutes = toRef(() => pad(minute.value))

  const numbers = toRef((): readonly ClockNumber[] => {
    if (view.value === 'minute') return SIXTY

    return format.value === '12' ? TWELVE : TWENTY_FOUR
  })

  const selected = toRef(() => {
    if (view.value === 'minute') return minute.value

    return format.value === '12' ? hour.value % 12 || 12 : hour.value
  })

  const angle = toRef(() => view.value === 'minute' ? minute.value * 6 : (hour.value % 12) * 30)

  const ring = toRef((): ClockRing => (
    view.value === 'hour' && format.value === '24' && inner(hour.value) ? 'inner' : 'outer'
  ))

  function set (time: ClockTime) {
    if (!Number.isInteger(time.hour) || time.hour < 0 || time.hour > 23) return
    if (!Number.isInteger(time.minute) || time.minute < 0 || time.minute > 59) return

    hour.value = time.hour
    minute.value = time.minute
  }

  function selectHour (ring: number) {
    if (format.value === '24') {
      set({ hour: ring, minute: minute.value })

      return
    }

    if (!Number.isInteger(ring) || ring < 1 || ring > 12) return

    set({ hour: (ring % 12) + (period.value === 'pm' ? 12 : 0), minute: minute.value })
  }

  function selectMinute (value: number) {
    set({ hour: hour.value, minute: value })
  }

  function selectPeriod (next: ClockPeriod) {
    set({ hour: (hour.value % 12) + (next === 'pm' ? 12 : 0), minute: minute.value })
  }

  function pick (raw: number, isInner = false): number {
    const angle = normalize(raw)

    if (view.value === 'minute') return Math.round(angle / 6) % 60

    const step = Math.round(angle / 30) % 12

    if (format.value === '12') return step === 0 ? 12 : step

    if (isInner) return step === 0 ? 0 : 12 + step

    return step === 0 ? 12 : step
  }

  function advance () {
    if (view.value === 'hour') view.value = 'minute'
  }

  watch(() => toValue(options.value), next => {
    const time = parseTime(next)

    if (time) set(time)
  }, { immediate: true })

  return {
    hour,
    minute,
    period,
    view,
    format,
    value,
    hours,
    minutes,
    numbers,
    selected,
    angle,
    ring,
    selectHour,
    selectMinute,
    selectPeriod,
    pick,
    advance,
    set,
  }
}
