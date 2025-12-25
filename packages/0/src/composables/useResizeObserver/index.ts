/**
 * @module useResizeObserver
 *
 * @remarks
 * ResizeObserver composable with lifecycle management.
 *
 * Key features:
 * - ResizeObserver API wrapper
 * - Pause/resume/stop functionality
 * - Automatic cleanup on unmount
 * - SSR-safe (checks SUPPORTS_OBSERVER)
 * - Hydration-aware
 * - Box model options (content-box/border-box)
 *
 * Perfect for responsive components and size-based rendering.
 */

// Globals
import { SUPPORTS_OBSERVER } from '#v0/constants/globals'

// Composables
import { useHydration } from '#v0/composables/useHydration'

// Utilities
import { isNull } from '#v0/utilities'
import { onScopeDispose, shallowReadonly, shallowRef, toRef, watchEffect } from 'vue'

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
  once?: boolean
  box?: 'content-box' | 'border-box'
}

export interface UseResizeObserverReturn {
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
): UseResizeObserverReturn {
  const { isHydrated } = useHydration()
  const observer = shallowRef<ResizeObserver | null>()
  const isPaused = shallowRef(false)
  const isActive = toRef(() => !!observer.value)

  function setup () {
    // null = permanently stopped, undefined = not yet created
    if (isNull(observer.value)) return
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

      if (options.once) {
        stop()
      }
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

  watchEffect(() => {
    // Track reactive dependencies
    const hydrated = isHydrated.value
    const el = target.value

    cleanup()

    if (hydrated && el) {
      setup()
    }
  })

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

export interface UseElementSizeReturn extends UseResizeObserverReturn {
  /**
   * The width of the element in pixels
   */
  width: Ref<number>

  /**
   * The height of the element in pixels
   */
  height: Ref<number>
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
export function useElementSize (target: Ref<Element | undefined>): UseElementSizeReturn {
  const width = shallowRef(0)
  const height = shallowRef(0)

  const { pause: _pause, resume, stop, isActive, isPaused } = useResizeObserver(
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

  function pause () {
    width.value = 0
    height.value = 0
    _pause()
  }

  return {
    width,
    height,
    isActive,
    isPaused,
    pause,
    resume,
    stop,
  }
}
