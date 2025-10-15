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

export interface ResizeObserverOptions {
  immediate?: boolean
  box?: 'content-box' | 'border-box'
}

/**
 * A composable that uses the Resize Observer API to detect when an element's
 * size changes.
 *
 * @param target The element to observe.
 * @param callback The callback to execute when the element's size changes.
 * @param options The options for the Resize Observer.
 * @returns An object with methods to control the observer.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver
 * @see https://0.vuetifyjs.com/composables/system/use-resize-observer
 *
 * @example
 * ```ts
 * import { ref } from 'vue'
 * import { useResizeObserver } from '@vuetify/v0'
 *
 * const el = ref<HTMLElement>()
 * const width = ref(0)
 * const height = ref(0)
 *
 * const { pause, resume, isPaused } = useResizeObserver(
 *   el,
 *   (entries) => {
 *     const entry = entries[0]
 *     if (entry) {
 *       width.value = entry.contentRect.width
 *       height.value = entry.contentRect.height
 *       console.log('Size changed:', width.value, 'x', height.value)
 *     }
 *   },
 *   { immediate: true }
 * )
 *
 * // Pause observation
 * pause()
 *
 * // Resume observation
 * resume()
 * ```
 */
export function useResizeObserver (
  target: Ref<Element | undefined>,
  callback: (entries: ResizeObserverEntry[]) => void,
  options: ResizeObserverOptions = {},
) {
  const { isHydrated } = useHydration()
  const observer = shallowRef<ResizeObserver>()
  const isPaused = shallowRef(false)

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
 * A convenience composable that uses the Resize Observer API to track an
 * element's size.
 *
 * @param target The element to observe.
 * @returns An object with the element's width and height.
 *
 * @see https://0.vuetifyjs.com/composables/system/use-resize-observer#use-element-size
 *
 * @example
 * ```ts
 * import { ref, watchEffect } from 'vue'
 * import { useElementSize } from '@vuetify/v0'
 *
 * const box = ref<HTMLElement>()
 * const { width, height } = useElementSize(box)
 *
 * // Width and height are reactive refs
 * watchEffect(() => {
 *   console.log('Box size:', width.value, 'x', height.value)
 * })
 * ```
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
