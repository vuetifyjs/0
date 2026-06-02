/**
 * @module createObserver
 *
 * @remarks
 * Internal factory for browser Observer API composables. Encapsulates the
 * shared lifecycle, hydration, pause/resume/stop, and target-watch logic
 * used by useResizeObserver, useIntersectionObserver, and useMutationObserver.
 *
 * The `observer` ref uses a three-state sentinel:
 * - `undefined` — not yet created
 * - `null` — permanently stopped (`stop()` was called; `setup()` is a no-op)
 * - instance — active observer
 *
 * @example
 * ```ts
 * import { createObserver } from '#v0/composables/createObserver'
 *
 * const observer = createObserver(target, entries => {
 *   console.log(entries)
 * }, {
 *   supports: true,
 *   create: cb => new ResizeObserver(cb),
 *   observe: (o, el) => o.observe(el),
 * })
 * ```
 */

// Composables
import { useHydration } from '#v0/composables/useHydration'

// Transformers
import { toElement } from '#v0/composables/toElement'

// Utilities
import { isElement, isNull } from '#v0/utilities'
import { onScopeDispose, shallowReadonly, shallowRef, toRef, watch } from 'vue'

// Types
import type { MaybeElementRef } from '#v0/composables/toElement'
import type { Ref } from 'vue'

export interface ObserverReturn {
  /**
   * Whether the observer is currently active (created and observing)
   */
  readonly isActive: Readonly<Ref<boolean>>
  /**
   * Whether the observer is currently paused
   */
  readonly isPaused: Readonly<Ref<boolean>>
  /**
   * Pause observation (disconnects observer but keeps it alive)
   */
  pause: () => void
  /**
   * Resume observation
   */
  resume: () => void
  /**
   * Stop observation and clean up (destroys observer)
   */
  stop: () => void
}

interface ObserverConfig<O extends { disconnect: () => void }, E> {
  supports: boolean
  once?: boolean
  create: (callback: (entries: E[]) => void) => O
  observe: (observer: O, el: Element) => void
  shouldStop?: (entries: E[]) => boolean
  onEntry?: (entries: E[]) => void
  onPause?: () => void
  immediate?: (el: Element) => E[]
  onceIncludesImmediate?: boolean
}

export function createObserver<O extends { disconnect: () => void }, E> (
  target: MaybeElementRef,
  userCallback: (entries: E[]) => void,
  config: ObserverConfig<O, E>,
): ObserverReturn {
  const { isHydrated } = useHydration()
  const resolved = toRef(() => toElement(target))
  const observer = shallowRef<O | null | undefined>(undefined)
  const isPaused = shallowRef(false)
  const isActive = toRef(() => !!observer.value && !isPaused.value)

  function invoke (entries: E[]) {
    config.onEntry?.(entries)
    userCallback(entries)

    if (config.once) {
      const shouldStop = config.shouldStop ? config.shouldStop(entries) : true
      if (shouldStop) stop()
    }
  }

  function setup () {
    if (isNull(observer.value)) return
    const el = resolved.value
    if (!isHydrated.value || !config.supports || !isElement(el) || isPaused.value) return

    observer.value = config.create(invoke)
    config.observe(observer.value, el)

    if (config.immediate) {
      const entries = config.immediate(el)
      if (config.onceIncludesImmediate) {
        invoke(entries)
      } else {
        config.onEntry?.(entries)
        userCallback(entries)
      }
    }
  }

  watch(
    resolved,
    (el, oldEl) => {
      if (oldEl || observer.value) cleanup()
      if (isHydrated.value && isElement(el)) setup()
    },
    { immediate: true },
  )

  let stopHydrationWatch: (() => void) | undefined
  if (!isHydrated.value) {
    stopHydrationWatch = watch(
      () => isHydrated.value,
      hydrated => {
        if (hydrated && isElement(resolved.value) && !observer.value) {
          setup()
          stopHydrationWatch?.()
          stopHydrationWatch = undefined
        }
      },
    )
  }

  function cleanup () {
    if (observer.value) {
      observer.value.disconnect()
      observer.value = undefined
    }
  }

  function pause () {
    isPaused.value = true
    config.onPause?.()
    observer.value?.disconnect()
  }

  function resume () {
    isPaused.value = false
    setup()
  }

  function stop () {
    stopHydrationWatch?.()
    stopHydrationWatch = undefined
    cleanup()
    observer.value = null
  }

  onScopeDispose(stop, true)

  return {
    isActive: shallowReadonly(isActive),
    isPaused: shallowReadonly(isPaused),
    pause,
    resume,
    stop,
  }
}
