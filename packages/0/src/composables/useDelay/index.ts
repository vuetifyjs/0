/**
 * @module useDelay
 *
 * @see https://0.vuetifyjs.com/composables/system/use-delay
 *
 * @remarks
 * Schedule open and close transitions with configurable delays.
 *
 * Composes `useTimer` for the underlying lifecycle (start / stop / pause / resume,
 * plus reactive `isActive`, `isPaused`, `remaining`) and adds direction tracking
 * (`isOpening`) and promise-based resolution.
 *
 * Key features:
 * - Reactive `openDelay` and `closeDelay` via `MaybeRefOrGetter`
 * - `start(isOpening)` returns a `Promise<boolean>` that resolves once the delay elapses
 * - Per-call `minDelay` floor enforces a minimum delay
 * - Automatic cleanup on scope disposal (inherited from `useTimer`)
 * - SSR-safe
 *
 * @example
 * ```ts
 * import { useDelay } from '@vuetify/v0'
 *
 * const delay = useDelay({
 *   openDelay: 300,
 *   closeDelay: 200,
 *   onChange: isOpening => isVisible.value = isOpening,
 * })
 *
 * delay.start(true)
 * delay.start(false, { minDelay: 500 })
 * ```
 */

// Composables
import { useTimer } from '#v0/composables/useTimer'

// Utilities
import { shallowReadonly, shallowRef, toValue } from 'vue'

// Types
import type { MaybeRefOrGetter, Ref } from 'vue'

export interface UseDelayOptions {
  /**
   * Delay in milliseconds before the opening transition fires.
   *
   * @example
   * ```ts
   * useDelay({ openDelay: 300 })
   * useDelay({ openDelay: () => isFocus.value ? 0 : 500 })
   * ```
   */
  openDelay?: MaybeRefOrGetter<number | string>
  /**
   * Delay in milliseconds before the closing transition fires.
   *
   * @example
   * ```ts
   * useDelay({ closeDelay: 200 })
   * ```
   */
  closeDelay?: MaybeRefOrGetter<number | string>
  /**
   * Callback invoked once a started delay elapses; receives the resolved direction.
   *
   * @example
   * ```ts
   * useDelay({
   *   openDelay: 300,
   *   onChange: isOpening => isVisible.value = isOpening,
   * })
   * ```
   */
  onChange?: (isOpening: boolean) => void
}

export interface UseDelayReturn {
  /**
   * Start a delay in the given direction. Restarts if already running. Resolves
   * with `isOpening` once the delay elapses. If `start()` is called again before
   * the previous resolves, the previous promise resolves with the new direction.
   *
   * @example
   * ```ts
   * const delay = useDelay({ openDelay: 300, closeDelay: 200 })
   * await delay.start(true)                    // resolves true after 300ms
   * await delay.start(false, { minDelay: 500 }) // resolves false after max(200, 500)
   * ```
   */
  start: (isOpening: boolean, options?: { minDelay?: number }) => Promise<boolean>
  /**
   * Stop the pending delay. Cancels any in-flight transition and resets state.
   *
   * @example
   * ```ts
   * delay.stop()
   * ```
   */
  stop: () => void
  /**
   * Pause the in-flight delay, preserving remaining time. No-op if not running.
   *
   * @example
   * ```ts
   * delay.pause()
   * ```
   */
  pause: () => void
  /**
   * Resume from where pause left off. No-op if not paused.
   *
   * @example
   * ```ts
   * delay.resume()
   * ```
   */
  resume: () => void
  /**
   * Whether a delay is currently pending (started, not stopped).
   */
  isActive: Readonly<Ref<boolean>>
  /**
   * Whether the pending delay is currently paused.
   */
  isPaused: Readonly<Ref<boolean>>
  /**
   * Milliseconds remaining until the pending transition fires.
   */
  remaining: Readonly<Ref<number>>
  /**
   * Direction of the pending transition (`true` = opening, `false` = closing).
   */
  isOpening: Readonly<Ref<boolean>>
}

/**
 * Schedule open and close transitions with configurable delays.
 *
 * Composes `useTimer` for the lifecycle (`start` / `stop` / `pause` / `resume` plus
 * reactive `isActive`, `isPaused`, `remaining`) and adds direction tracking
 * (`isOpening`) and promise-based resolution.
 *
 * @param options Reactive delay settings and an optional `onChange` callback.
 * @returns Lifecycle controls and reactive state.
 *
 * @see https://0.vuetifyjs.com/composables/system/use-delay
 *
 * @example
 * ```ts
 * const delay = useDelay({
 *   openDelay: 300,
 *   closeDelay: 200,
 *   onChange: isOpening => isVisible.value = isOpening,
 * })
 *
 * delay.start(true)
 * delay.start(false, { minDelay: 500 })
 * delay.pause()
 * delay.resume()
 * delay.stop()
 * ```
 */
export function useDelay (options: UseDelayOptions = {}): UseDelayReturn {
  const { openDelay, closeDelay, onChange } = options

  const isOpening = shallowRef(false)
  const minDelay = shallowRef(0)

  let pendingResolve: ((value: boolean) => void) | undefined

  function fire () {
    const direction = isOpening.value
    const resolve = pendingResolve
    pendingResolve = undefined

    onChange?.(direction)
    resolve?.(direction)
  }

  function resolveDuration () {
    const raw = isOpening.value ? toValue(openDelay) : toValue(closeDelay)
    const base = Number(raw ?? 0) || 0
    return Math.max(minDelay.value, base)
  }

  const timer = useTimer(fire, { duration: resolveDuration })

  function start (direction: boolean, runOptions: { minDelay?: number } = {}) {
    const previousResolve = pendingResolve

    isOpening.value = direction
    minDelay.value = runOptions.minDelay ?? 0

    const ms = resolveDuration()

    return new Promise<boolean>(resolve => {
      pendingResolve = resolve
      previousResolve?.(direction)

      if (ms <= 0) {
        timer.stop()
        fire()
        return
      }

      timer.start()
    })
  }

  function stop () {
    pendingResolve = undefined
    timer.stop()
  }

  return {
    start,
    stop,
    pause: timer.pause,
    resume: timer.resume,
    isActive: timer.isActive,
    isPaused: timer.isPaused,
    remaining: timer.remaining,
    isOpening: shallowReadonly(isOpening),
  }
}
