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
 * - Automatic cleanup on scope disposal (timer cleared, pending promise settled with current direction)
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
import { onScopeDispose, shallowReadonly, shallowRef, toValue } from 'vue'

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
  openDelay?: MaybeRefOrGetter<number>
  /**
   * Delay in milliseconds before the closing transition fires.
   *
   * @example
   * ```ts
   * useDelay({ closeDelay: 200 })
   * ```
   */
  closeDelay?: MaybeRefOrGetter<number>
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

/**
 * Per-call options for `start()`.
 *
 * @example
 * ```ts
 * delay.start(false, { minDelay: 500 })
 * ```
 */
export interface UseDelayStartOptions {
  /** Minimum delay floor in ms; max(configuredDelay, minDelay) wins. */
  minDelay?: number
}

/**
 * The reactive controls and state surface returned by `useDelay`.
 *
 * @example
 * ```ts
 * const { start, stop, pause, resume, isActive, isOpening } = useDelay({
 *   openDelay: 300,
 *   closeDelay: 200,
 * })
 *
 * start(true)
 * ```
 */
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
  start: (isOpening: boolean, options?: UseDelayStartOptions) => Promise<boolean>
  /**
   * Cancel any pending delay and reset state. Resolves the pending promise with the current direction.
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
  let minDelay = 0

  let pendingResolve: ((value: boolean) => void) | undefined

  function fire () {
    const direction = isOpening.value
    const resolve = pendingResolve
    pendingResolve = undefined
    resolve?.(direction)
    onChange?.(direction)
  }

  function resolveDuration () {
    const raw = isOpening.value ? toValue(openDelay) : toValue(closeDelay)
    return Math.max(minDelay, raw ?? 0)
  }

  const timer = useTimer(fire, { duration: resolveDuration })

  function start (direction: boolean, options: UseDelayStartOptions = {}) {
    const previousResolve = pendingResolve
    pendingResolve = undefined
    isOpening.value = direction
    minDelay = options.minDelay ?? 0
    previousResolve?.(direction)
    const ms = resolveDuration()

    return new Promise<boolean>(resolve => {
      pendingResolve = resolve
      if (ms <= 0) {
        timer.stop()
        fire()
        return
      }
      timer.start()
    })
  }

  function stop () {
    const resolve = pendingResolve
    pendingResolve = undefined
    timer.stop()
    resolve?.(isOpening.value)
  }

  onScopeDispose(() => {
    const resolve = pendingResolve
    pendingResolve = undefined
    resolve?.(isOpening.value)
  }, true)

  return {
    start,
    stop,
    pause: timer.pause,
    resume: timer.resume,
    isActive: shallowReadonly(timer.isActive),
    isPaused: shallowReadonly(timer.isPaused),
    remaining: shallowReadonly(timer.remaining),
    isOpening: shallowReadonly(isOpening),
  }
}
