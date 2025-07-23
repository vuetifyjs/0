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

export interface UseIntersectionObserverOptions {
  immediate?: boolean
  root?: Element | null
  rootMargin?: string
  threshold?: number | number[]
}

/**
 * Composable for observing element intersection with viewport or ancestor
 *
 * @param target - Element ref to observe
 * @param callback - Callback fired on intersection change
 * @param options - Observer options
 * @returns Observer controls and intersection state
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver
 */
export function useIntersectionObserver (
  target: Ref<Element | undefined>,
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: UseIntersectionObserverOptions = {},
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
 * Convenience composable for simple intersection detection
 *
 * @param target - Element ref to observe
 * @param options - Observer options
 * @returns Reactive intersection state
 */
export function useElementIntersection (
  target: Ref<Element | undefined>,
  options: UseIntersectionObserverOptions = {},
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
