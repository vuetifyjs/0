/**
 * @module useTimer
 *
 * @see https://0.vuetifyjs.com/composables/system/use-timer
 *
 * @remarks
 * A reactive timer composable with pause/resume support.
 *
 * Key features:
 * - Start/stop/pause/resume controls
 * - Reactive remaining time tracking
 * - Reactive `duration` via `MaybeRefOrGetter` — read fresh on each `start()`
 * - One-shot (default) or repeating mode
 * - Automatic cleanup on scope disposal
 * - SSR-safe
 *
 * @example
 * ```ts
 * import { useTimer } from '@vuetify/v0'
 *
 * const timer = useTimer(() => console.log('fired'), { duration: 5000 })
 * timer.start()
 * ```
 */

// Constants
import { IN_BROWSER } from '#v0/constants/globals'

// Utilities
import { isUndefined } from '#v0/utilities'
import { onScopeDispose, shallowRef, toValue } from 'vue'

// Types
import type { MaybeRefOrGetter, ShallowRef } from 'vue'

export interface TimerOptions {
  /**
   * Duration in milliseconds. Accepts a plain number, ref, or getter — the
   * value is read fresh each time `start()` is invoked, so reactive sources
   * can change between runs without recreating the timer.
   *
   * @default 1000
   *
   * @example
   * ```ts
   * useTimer(handler, { duration: 5000 })
   * useTimer(handler, { duration: () => isFast.value ? 100 : 1000 })
   * ```
   */
  duration?: MaybeRefOrGetter<number>
  /**
   * Whether the timer repeats after firing.
   * @default false
   */
  repeat?: boolean
}

export interface TimerContext {
  /** Start the timer. Restarts if already running. */
  start: () => void
  /** Stop the timer and reset remaining to full duration. */
  stop: () => void
  /** Pause the timer, preserving remaining time. No-op if not running. */
  pause: () => void
  /** Resume from where pause left off. No-op if not paused. */
  resume: () => void
  /** Milliseconds left until next fire. */
  remaining: ShallowRef<number>
  /** Whether the timer is currently active (started and not stopped). */
  isActive: ShallowRef<boolean>
  /** Whether the timer is currently paused. */
  isPaused: ShallowRef<boolean>
}

/**
 * Creates a reactive timer with pause/resume support.
 *
 * @param handler Callback invoked when the timer fires.
 * @param options Timer configuration.
 * @returns Timer controls and reactive state.
 *
 * @see https://0.vuetifyjs.com/composables/system/use-timer
 *
 * @example
 * ```ts
 * const timer = useTimer(() => console.log('fired'), { duration: 5000 })
 *
 * timer.start()
 * timer.pause()
 * timer.resume()
 * timer.stop()
 *
 * // Reactive duration — re-read on each start()
 * const duration = shallowRef(1000)
 * const reactive = useTimer(handler, { duration })
 * duration.value = 2000
 * reactive.start() // fires after 2000ms
 * ```
 */
export function useTimer (
  handler: () => void,
  options: TimerOptions = {},
): TimerContext {
  const { duration = 1000, repeat = false } = options

  function resolveDuration () {
    return toValue(duration)
  }

  const remaining = shallowRef(resolveDuration())
  const isActive = shallowRef(false)
  const isPaused = shallowRef(false)

  let timeoutId: ReturnType<typeof setTimeout> | undefined
  let trackingId: ReturnType<typeof setInterval> | undefined
  let startedAt = 0
  let budget = remaining.value

  function clearTimer () {
    if (!isUndefined(timeoutId)) {
      globalThis.clearTimeout(timeoutId)
      timeoutId = undefined
    }
  }

  function startTracking () {
    stopTracking()

    if (!IN_BROWSER) return

    trackingId = globalThis.setInterval(() => {
      if (!isActive.value || isPaused.value) return

      const elapsed = Date.now() - startedAt
      remaining.value = Math.max(0, budget - elapsed)
    }, 100)
  }

  function stopTracking () {
    if (!isUndefined(trackingId)) {
      globalThis.clearInterval(trackingId)
      trackingId = undefined
    }
  }

  function fire () {
    clearTimer()
    stopTracking()

    handler()

    if (repeat) {
      begin(resolveDuration())
    } else {
      isActive.value = false
      remaining.value = 0
    }
  }

  function begin (ms: number) {
    clearTimer()
    stopTracking()

    budget = ms
    startedAt = Date.now()
    remaining.value = ms
    isActive.value = true
    isPaused.value = false

    timeoutId = globalThis.setTimeout(fire, ms)
    startTracking()
  }

  function start () {
    const ms = resolveDuration()
    if (ms < 0) return

    begin(ms)
  }

  function stop () {
    clearTimer()
    stopTracking()
    isActive.value = false
    isPaused.value = false
    remaining.value = resolveDuration()
  }

  function pause () {
    if (!isActive.value || isPaused.value) return

    const elapsed = Date.now() - startedAt
    budget = Math.max(0, budget - elapsed)
    remaining.value = budget

    clearTimer()
    stopTracking()
    isPaused.value = true
  }

  function resume () {
    if (!isPaused.value) return

    isPaused.value = false
    startedAt = Date.now()

    timeoutId = globalThis.setTimeout(fire, budget)
    startTracking()
  }

  onScopeDispose(() => {
    clearTimer()
    stopTracking()
  }, true)

  return {
    start,
    stop,
    pause,
    resume,
    remaining,
    isActive,
    isPaused,
  }
}
