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

// Globals
import { SUPPORTS_INTERSECTION_OBSERVER } from '#v0/constants/globals'

// Composables
import { createObserver } from '#v0/composables/createObserver'

// Utilities
import { shallowReadonly, shallowRef } from 'vue'

// Types
import type { ObserverReturn } from '#v0/composables/createObserver'
import type { Ref, MaybeRefOrGetter } from 'vue'

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
  once?: boolean
  root?: Element | null
  rootMargin?: string
  threshold?: number | number[]
}

export interface UseIntersectionObserverReturn extends ObserverReturn {
  /**
   * Whether the target element is currently intersecting with the viewport
   */
  readonly isIntersecting: Readonly<Ref<boolean>>
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
  target: MaybeRefOrGetter<Element | null | undefined>,
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverOptions = {},
): UseIntersectionObserverReturn {
  const isIntersecting = shallowRef(false)

  const base = createObserver(target, callback, {
    supports: SUPPORTS_INTERSECTION_OBSERVER,
    once: options.once,
    create: cb => new IntersectionObserver(entries => {
      cb(entries.map(e => ({
        boundingClientRect: e.boundingClientRect,
        intersectionRatio: e.intersectionRatio,
        intersectionRect: e.intersectionRect,
        isIntersecting: e.isIntersecting,
        rootBounds: e.rootBounds,
        target: e.target,
        time: e.time,
      })))
    }, {
      root: options.root ?? null,
      rootMargin: options.rootMargin ?? '0px',
      threshold: options.threshold ?? 0,
    }),
    observe: (obs, el) => obs.observe(el),
    onEntry: entries => {
      const latest = entries.at(-1)
      if (latest) isIntersecting.value = latest.isIntersecting
    },
    onPause: () => {
      isIntersecting.value = false
    },
    shouldStop: entries => entries.at(-1)?.isIntersecting ?? false,
    immediate: options.immediate
      ? el => {
        const rect = el.getBoundingClientRect()
        return [{
          boundingClientRect: rect,
          intersectionRatio: 0,
          intersectionRect: new DOMRect(0, 0, 0, 0),
          isIntersecting: false,
          rootBounds: null,
          target: el,
          time: performance.now(),
        }]
      }
      : undefined,
  })

  return {
    ...base,
    isIntersecting: shallowReadonly(isIntersecting),
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
  target: MaybeRefOrGetter<Element | null | undefined>,
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
