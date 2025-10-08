// Composables
import { useHydration } from '#v0/composables/useHydration'

// Utilities
import { shallowRef, watch, onUnmounted, readonly } from 'vue'

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
 * @example
 * ```ts
 * const { isIntersecting, pause, resume } = useIntersectionObserver(
 *   target,
 *   (entries) => {
 *     console.log('Intersection entries:', entries)
 *   },
 *   { immediate: true, threshold: 0.5 }
 *  ```
 */
export function useIntersectionObserver (
  target: Ref<Element | undefined>,
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverOptions = {},
) {
  const { isHydrated } = useHydration()
  const observer = shallowRef<IntersectionObserver>()
  const isPaused = shallowRef(false)
  const isIntersecting = shallowRef(false)

  watch([isHydrated, target], ([hydrated, el]) => {
    cleanup()

    if (!hydrated || !SUPPORTS_INTERSECTION_OBSERVER || !el) return

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

      // Update reactive state
      const latestEntry = transformedEntries.at(-1)
      if (latestEntry) {
        isIntersecting.value = latestEntry.isIntersecting
      }

      callback(transformedEntries)
    }, {
      root: options.root || null,
      rootMargin: options.rootMargin || '0px',
      threshold: options.threshold || 0,
    })

    observer.value.observe(el)

    if (options.immediate) {
      // For immediate callback, we need to create a synthetic entry
      // Since we can't know intersection state without actual observation,
      // we'll call with initial state (typically not intersecting)
      const rect = el.getBoundingClientRect()
      const syntheticEntry: IntersectionObserverEntry = {
        boundingClientRect: rect,
        intersectionRatio: 0,
        intersectionRect: new DOMRect(0, 0, 0, 0),
        isIntersecting: false,
        rootBounds: null,
        target: el,
        time: performance.now(),
      }

      callback([syntheticEntry])
    }
  })

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

  function cleanup () {
    if (observer.value) {
      observer.value.disconnect()
      observer.value = undefined
    }
  }

  function pause () {
    isPaused.value = true
    observer.value?.disconnect()
  }

  function resume () {
    isPaused.value = false
    setup()
  }

  function stop () {
    cleanup()
  }

  onUnmounted(stop)

  return {
    isIntersecting: readonly(isIntersecting),
    isPaused: readonly(isPaused),
    pause,
    resume,
    stop,
  }
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
 * @examples
 * ```ts
 * const myElement = ref<HTMLElement>()
 * const { isIntersecting, intersectionRatio } = useElementIntersection(myElement)
 * ```
 */
export function useElementIntersection (
  target: Ref<Element | undefined>,
  options: IntersectionObserverOptions = {},
) {
  const isIntersecting = shallowRef(false)
  const intersectionRatio = shallowRef(0)

  useIntersectionObserver(
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

  return {
    isIntersecting: readonly(isIntersecting),
    intersectionRatio: readonly(intersectionRatio),
  }
}
