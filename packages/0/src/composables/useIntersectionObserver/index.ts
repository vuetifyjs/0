/**
 * @module useIntersectionObserver
 *
 * @remarks
 * IntersectionObserver composable with lifecycle management.
 *
 * Key features:
 * - IntersectionObserver API wrapper
 * - Pause/resume/stop functionality
 * - Automatic cleanup on unmount
 * - SSR-safe (checks SUPPORTS_INTERSECTION_OBSERVER)
 * - Hydration-aware
 * - Immediate callback option
 *
 * Perfect for lazy loading, infinite scroll, and visibility detection.
 */

// Composables
import { useHydration } from '#v0/composables/useHydration'

// Utilities
import { onScopeDispose, shallowReadonly, shallowRef, toRef, watch } from 'vue'

// Globals
import { SUPPORTS_INTERSECTION_OBSERVER } from '#v0/constants/globals'

// Types
import type { Ref } from 'vue'

export interface IntersectionObserverEntry {
  boundingClientRect: DOMRectReadOnly
  intersectionRatio: number
  intersectionRect: DOMRectReadOnly
  isIntersecting: boolean
  rootBounds: DOMRectReadOnly | null
  target: Element
  time: number
}

export interface IntersectionObserverOptions {
  immediate?: boolean
  root?: Element | null
  rootMargin?: string
  threshold?: number | number[]
}

export interface UseIntersectionObserverReturn {
  /**
   * Whether the observer is currently active (created and observing)
   */
  readonly isActive: Readonly<Ref<boolean>>

  /**
   * Whether the target element is currently intersecting with the viewport
   */
  readonly isIntersecting: Readonly<Ref<boolean>>

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

/**
 * A composable that uses the Intersection Observer API to detect when an element
 * is visible in the viewport.
 *
 * @param target The element to observe.
 * @param callback The callback to execute when the element's intersection changes.
 * @param options The options for the Intersection Observer.
 * @returns An object with methods to control the observer.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver
 * @see https://0.vuetifyjs.com/composables/system/use-intersection-observer
 *
 * @example
 * ```ts
 * import { ref } from 'vue'
 * import { useIntersectionObserver } from '@vuetify/v0'
 *
 * const target = ref<HTMLElement>()
 * const isVisible = ref(false)
 *
 * const { isIntersecting, pause, resume } = useIntersectionObserver(
 *   target,
 *   (entries) => {
 *     const entry = entries[0]
 *     if (entry) {
 *       isVisible.value = entry.isIntersecting
 *       console.log('Element is visible:', entry.isIntersecting)
 *     }
 *   },
 *   { threshold: 0.5 }
 * )
 *
 * // Pause observation
 * pause()
 *
 * // Resume observation
 * resume()
 * ```
 */
export function useIntersectionObserver (
  target: Ref<Element | undefined>,
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverOptions = {},
): UseIntersectionObserverReturn {
  const { isHydrated } = useHydration()
  const observer = shallowRef<IntersectionObserver>()
  const isPaused = shallowRef(false)
  const isIntersecting = shallowRef(false)
  const isActive = toRef(() => !!observer.value)

  function setup () {
    if (!isHydrated.value || !SUPPORTS_INTERSECTION_OBSERVER || !target.value || isPaused.value) return

    observer.value = new IntersectionObserver(entries => {
      const transformedEntries: IntersectionObserverEntry[] = entries.map(entry => ({
        boundingClientRect: entry.boundingClientRect,
        intersectionRatio: entry.intersectionRatio,
        intersectionRect: entry.intersectionRect,
        isIntersecting: entry.isIntersecting,
        rootBounds: entry.rootBounds,
        target: entry.target,
        time: entry.time,
      }))

      const latestEntry = transformedEntries.at(-1)
      if (latestEntry) isIntersecting.value = latestEntry.isIntersecting

      callback(transformedEntries)
    }, {
      root: options.root || null,
      rootMargin: options.rootMargin || '0px',
      threshold: options.threshold || 0,
    })

    observer.value.observe(target.value)

    if (options.immediate) {
      const rect = target.value.getBoundingClientRect()
      const syntheticEntry: IntersectionObserverEntry = {
        boundingClientRect: rect,
        intersectionRatio: 0,
        intersectionRect: new DOMRect(0, 0, 0, 0),
        isIntersecting: false,
        rootBounds: null,
        target: target.value,
        time: performance.now(),
      }

      callback([syntheticEntry])
    }
  }

  watch([isHydrated, target], () => {
    cleanup()
    setup()
  }, { immediate: true })

  function cleanup () {
    if (observer.value) {
      observer.value.disconnect()
      observer.value = undefined
    }
  }

  function pause () {
    isPaused.value = true
    isIntersecting.value = false
    observer.value?.disconnect()
  }

  function resume () {
    isPaused.value = false
    setup()
  }

  function stop () {
    cleanup()
  }

  onScopeDispose(stop, true)

  return {
    isActive: shallowReadonly(isActive),
    isIntersecting: shallowReadonly(isIntersecting),
    isPaused: shallowReadonly(isPaused),
    pause,
    resume,
    stop,
  }
}

export interface UseElementIntersectionReturn extends UseIntersectionObserverReturn {
  /**
   * The intersection ratio (0.0 to 1.0) indicating how much of the element is visible
   */
  readonly intersectionRatio: Readonly<Ref<number>>
}

/**
 * A convenience composable that uses the Intersection Observer API to detect
 * when an element is visible in the viewport.
 *
 * @param target The element to observe.
 * @param options The options for the Intersection Observer.
 * @returns An object with the intersection state.
 *
 * @see https://0.vuetifyjs.com/composables/system/use-intersection-observer
 *
 * @example
 * ```ts
 * import { ref } from 'vue'
 * import { useElementIntersection } from '@vuetify/v0'
 *
 * const myElement = ref<HTMLElement>()
 * const { isIntersecting, intersectionRatio } = useElementIntersection(myElement, {
 *   threshold: 0.5
 * })
 *
 * // Use in template to conditionally render or animate
 * watchEffect(() => {
 *   if (isIntersecting.value) {
 *     console.log('Element is visible!', intersectionRatio.value)
 *   }
 * })
 * ```
 */
export function useElementIntersection (
  target: Ref<Element | undefined>,
  options: IntersectionObserverOptions = {},
): UseElementIntersectionReturn {
  const isIntersecting = shallowRef(false)
  const intersectionRatio = shallowRef(0)

  const { pause: _pause, resume, stop, isActive, isPaused } = useIntersectionObserver(
    target,
    entries => {
      const entry = entries.at(-1)
      if (entry) {
        isIntersecting.value = entry.isIntersecting
        intersectionRatio.value = entry.intersectionRatio
      }
    },
    { immediate: true, ...options },
  )

  function pause () {
    isIntersecting.value = false
    intersectionRatio.value = 0
    _pause()
  }

  return {
    isIntersecting: shallowReadonly(isIntersecting),
    intersectionRatio: shallowReadonly(intersectionRatio),
    isActive,
    isPaused,
    pause,
    resume,
    stop,
  }
}
