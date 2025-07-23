// Utilities
import { shallowRef, watch, onUnmounted, readonly } from 'vue'

// Composables
import { useHydration } from '#v0/composables/useHydration'

// Globals
import { SUPPORTS_OBSERVER } from '#v0/constants/globals'

// Types
import type { Ref } from 'vue'

export interface ResizeObserverEntry {
  contentRect: {
    width: number
    height: number
    top: number
    left: number
  }
  target: Element
}

export interface UseResizeObserverOptions {
  immediate?: boolean
  box?: 'content-box' | 'border-box'
}

/**
 * Composable for observing element resize events
 *
 * @param target - Element ref to observe
 * @param callback - Callback fired on resize
 * @param options - Observer options
 * @returns Observer controls
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver
 */
export function useResizeObserver (
  target: Ref<Element | undefined>,
  callback: (entries: ResizeObserverEntry[]) => void,
  options: UseResizeObserverOptions = {},
) {
  const { isHydrated } = useHydration()
  const observer = shallowRef<ResizeObserver>()
  const isPaused = shallowRef(false)

  watch([isHydrated, target], ([hydrated, el]) => {
    cleanup()

    if (!hydrated || !SUPPORTS_OBSERVER || !el) return

    observer.value = new ResizeObserver(entries => {
      const transformedEntries: ResizeObserverEntry[] = entries.map(entry => ({
        contentRect: {
          width: entry.contentRect.width,
          height: entry.contentRect.height,
          top: entry.contentRect.top,
          left: entry.contentRect.left,
        },
        target: entry.target,
      }))

      callback(transformedEntries)
    })

    observer.value.observe(el, {
      box: options.box || 'content-box',
    })

    if (options.immediate) {
      const rect = el.getBoundingClientRect()
      callback([{
        contentRect: {
          width: rect.width,
          height: rect.height,
          top: rect.top,
          left: rect.left,
        },
        target: el,
      }])
    }
  })

  function setup () {
    if (!isHydrated.value || !SUPPORTS_OBSERVER || !target.value || isPaused.value) return

    observer.value = new ResizeObserver(entries => {
      const transformedEntries: ResizeObserverEntry[] = entries.map(entry => ({
        contentRect: {
          width: entry.contentRect.width,
          height: entry.contentRect.height,
          top: entry.contentRect.top,
          left: entry.contentRect.left,
        },
        target: entry.target,
      }))

      callback(transformedEntries)
    })

    observer.value.observe(target.value, {
      box: options.box || 'content-box',
    })

    if (options.immediate) {
      const rect = target.value.getBoundingClientRect()
      callback([{
        contentRect: {
          width: rect.width,
          height: rect.height,
          top: rect.top,
          left: rect.left,
        },
        target: target.value,
      }])
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
    isPaused: readonly(isPaused),
    pause,
    resume,
    stop,
  }
}

/**
 * Convenience composable for tracking element dimensions
 *
 * @param target - Element ref to observe
 * @returns Reactive width and height
 */
export function useElementSize (target: Ref<Element | undefined>) {
  const width = shallowRef(0)
  const height = shallowRef(0)

  useResizeObserver(
    target,
    entries => {
      const entry = entries[0]
      if (entry) {
        width.value = entry.contentRect.width
        height.value = entry.contentRect.height
      }
    },
    { immediate: true },
  )

  return { width, height }
}
