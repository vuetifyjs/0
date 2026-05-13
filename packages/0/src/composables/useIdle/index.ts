/**
 * @module useIdle
 *
 * @see https://0.vuetifyjs.com/composables/system/use-idle
 *
 * @remarks
 * Tracks user inactivity with optional warn stage and pause / resume control.
 *
 * Key features:
 * - Reactive `stage`, `isIdle`, `isWarning`, `isPaused`, and `lastActivity`
 * - Reactive `timeout`, `warnAt`, and `events` (re-register / re-schedule on change)
 * - Optional warn stage before idle for "you'll be logged out in 30s" patterns
 * - pause / resume (fresh re-schedule on resume — elapsed time is not preserved)
 * - Reset on tab-visibility change (opt-out)
 * - Automatic cleanup on scope disposal
 * - SSR-safe
 *
 * @example
 * ```ts
 * import { useIdle } from '@vuetify/v0'
 *
 * const idle = useIdle(
 *   stage => stage === 'idle' ? logout() : showWarning(),
 *   { timeout: 10 * 60_000, warnAt: 9 * 60_000 },
 * )
 * ```
 */

// Globals
import { IN_BROWSER } from '#v0/constants/globals'

// Composables
import { useDocumentEventListener, useWindowEventListener } from '#v0/composables/useEventListener'

// Utilities
import { isUndefined } from '#v0/utilities'
import { onScopeDispose, shallowReadonly, shallowRef, toRef, toValue, watch } from 'vue'

// Types
import type { MaybeRefOrGetter, Ref } from 'vue'

const DEFAULT_EVENTS: (keyof WindowEventMap)[] = [
  'mousemove',
  'mousedown',
  'keydown',
  'touchstart',
  'scroll',
  'wheel',
]

export type IdleStage = 'active' | 'warn' | 'idle'

export interface UseIdleOptions {
  /**
   * Milliseconds of inactivity before transitioning to `'idle'`.
   *
   * @default 60000
   *
   * @example
   * ```ts
   * useIdle(handler, { timeout: 5 * 60_000 })
   * useIdle(handler, { timeout: () => fast.value ? 1_000 : 60_000 })
   * ```
   */
  timeout?: MaybeRefOrGetter<number>
  /**
   * Milliseconds of inactivity before transitioning to `'warn'`. Must be less
   * than `timeout`. When undefined — or when `warnAt >= timeout` — the warn
   * stage is silently skipped.
   *
   * @default undefined
   *
   * @example
   * ```ts
   * useIdle(handler, { timeout: 600_000, warnAt: 540_000 })
   * ```
   */
  warnAt?: MaybeRefOrGetter<number | undefined>
  /**
   * Window events that count as user activity.
   *
   * @default ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'wheel']
   *
   * @example
   * ```ts
   * useIdle(handler, { events: ['keydown', 'pointerdown'] })
   * ```
   */
  events?: MaybeRefOrGetter<(keyof WindowEventMap)[]>
  /**
   * Whether to start in the idle state.
   *
   * @default false
   */
  initialState?: boolean
  /**
   * Reset to active when the user switches back to this tab.
   *
   * @default true
   */
  resetOnTabSwitch?: boolean
}

export interface UseIdleContext {
  /** Current stage. */
  stage: Readonly<Ref<IdleStage>>
  /** True when `stage === 'idle'`. */
  isIdle: Readonly<Ref<boolean>>
  /** True when `stage === 'warn'`. */
  isWarning: Readonly<Ref<boolean>>
  /** True when detection is paused. */
  isPaused: Readonly<Ref<boolean>>
  /** Epoch milliseconds of the most recent activity. */
  lastActivity: Readonly<Ref<number>>
  /** Mark the user as active and restart the countdown. No-op while paused. */
  reset: () => void
  /** Pause detection, clearing any pending warn / idle transition. */
  pause: () => void
  /** Resume detection. Re-schedules fresh from the current `timeout` / `warnAt`. */
  resume: () => void
}

/**
 * Tracks user inactivity with optional warn stage and pause control.
 *
 * @param callback Optional callback fired on each forward transition (`'warn'` or `'idle'`).
 * @param options Idle detection options.
 * @returns Reactive idle state and controls.
 *
 * @see https://0.vuetifyjs.com/composables/system/use-idle
 *
 * @example
 * ```ts
 * const { isIdle } = useIdle(undefined, { timeout: 5_000 })
 *
 * useIdle(
 *   stage => stage === 'idle' ? logout() : showWarning(),
 *   { timeout: 600_000, warnAt: 540_000 },
 * )
 * ```
 */
export function useIdle (
  callback?: (stage: 'warn' | 'idle') => void,
  options: UseIdleOptions = {},
): UseIdleContext {
  const {
    timeout = 60_000,
    warnAt,
    events = DEFAULT_EVENTS,
    initialState = false,
    resetOnTabSwitch = true,
  } = options

  const stage = shallowRef<IdleStage>(initialState ? 'idle' : 'active')
  const isIdle = toRef(() => stage.value === 'idle')
  const isWarning = toRef(() => stage.value === 'warn')
  const isPaused = shallowRef(false)
  const lastActivity = shallowRef(Date.now())

  let warnId: ReturnType<typeof setTimeout> | undefined
  let idleId: ReturnType<typeof setTimeout> | undefined

  function clear () {
    if (!isUndefined(warnId)) {
      globalThis.clearTimeout(warnId)
      warnId = undefined
    }
    if (!isUndefined(idleId)) {
      globalThis.clearTimeout(idleId)
      idleId = undefined
    }
  }

  function schedule () {
    clear()
    if (!IN_BROWSER || isPaused.value) return

    const idleMs = toValue(timeout)
    const warnMs = toValue(warnAt)

    if (!isUndefined(warnMs) && warnMs > 0 && warnMs < idleMs) {
      warnId = globalThis.setTimeout(() => {
        stage.value = 'warn'
        callback?.('warn')
        idleId = globalThis.setTimeout(() => {
          stage.value = 'idle'
          callback?.('idle')
        }, idleMs - warnMs)
      }, warnMs)
    } else {
      idleId = globalThis.setTimeout(() => {
        stage.value = 'idle'
        callback?.('idle')
      }, idleMs)
    }
  }

  function reset () {
    lastActivity.value = Date.now()
    stage.value = 'active'
    schedule()
  }

  function pause () {
    if (isPaused.value) return
    isPaused.value = true
    clear()
  }

  function resume () {
    if (!isPaused.value) return
    isPaused.value = false
    schedule()
  }

  useWindowEventListener(() => toValue(events), reset, { passive: true })

  if (resetOnTabSwitch) {
    useDocumentEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') reset()
    })
  }

  watch([() => toValue(timeout), () => toValue(warnAt)], () => {
    if (stage.value === 'active' && !isPaused.value) schedule()
  })

  if (!initialState) schedule()

  onScopeDispose(clear, true)

  return {
    stage: shallowReadonly(stage),
    isIdle,
    isWarning,
    isPaused: shallowReadonly(isPaused),
    lastActivity: shallowReadonly(lastActivity),
    reset,
    pause,
    resume,
  }
}
