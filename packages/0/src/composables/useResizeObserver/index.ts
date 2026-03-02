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
import { createObserver } from '#v0/composables/createObserver'

// Utilities
import { shallowReadonly, shallowRef } from 'vue'

// Types
import type { ObserverReturn } from '#v0/composables/createObserver'
import type { Ref, MaybeRefOrGetter } from 'vue'

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

export interface UseResizeObserverReturn extends ObserverReturn {}

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
  target: MaybeRefOrGetter<Element | null | undefined>,
  callback: (entries: ResizeObserverEntry[]) => void,
  options: ResizeObserverOptions = {},
): UseResizeObserverReturn {
  return createObserver(target, callback, {
    supports: SUPPORTS_OBSERVER,
    once: options.once,
    create: cb => new ResizeObserver(entries => {
      cb(entries.map(e => ({
        contentRect: {
          width: e.contentRect.width,
          height: e.contentRect.height,
          top: e.contentRect.top,
          left: e.contentRect.left,
        },
        target: e.target,
      })))
    }),
    observe: (obs, el) => obs.observe(el, { box: options.box ?? 'content-box' }),
    immediate: options.immediate
      ? el => {
        const rect = el.getBoundingClientRect()
        return [{
          contentRect: {
            width: rect.width,
            height: rect.height,
            top: rect.top,
            left: rect.left,
          },
          target: el,
        }]
      }
      : undefined,
  })
}

export interface UseElementSizeReturn extends UseResizeObserverReturn {
  /**
   * The width of the element in pixels
   */
  readonly width: Readonly<Ref<number>>

  /**
   * The height of the element in pixels
   */
  readonly height: Readonly<Ref<number>>
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
export function useElementSize (target: MaybeRefOrGetter<Element | null | undefined>): UseElementSizeReturn {
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
    isPaused: shallowReadonly(isPaused),
    pause,
    resume,
    stop,
  }
}
