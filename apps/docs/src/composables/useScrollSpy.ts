/**
 * @module useScrollSpy
 *
 * @remarks
 * Scroll spy composable that tracks which element is currently selected
 * based on viewport intersection.
 *
 * Key features:
 * - Uses IntersectionObserver for viewport detection
 * - Configurable root margin for intersection zone
 * - Automatic cleanup on scope dispose
 * - SSR-safe
 *
 * Designed to be extractable to @vuetify/v0 in the future.
 */

import { useIntersectionObserver } from '@vuetify/v0'
import { IN_BROWSER } from '@vuetify/v0/constants'
import { computed, onScopeDispose, shallowReactive, shallowRef } from 'vue'
import type { Ref } from 'vue'

export interface ScrollSpyOptions {
  /**
   * Root margin for intersection observer.
   * Default activates when element enters top 20% of viewport.
   * @default '0px 0px -80% 0px'
   */
  rootMargin?: string

  /**
   * Threshold for intersection.
   * @default 0
   */
  threshold?: number | number[]

  /**
   * Root element for intersection observer.
   * @default null (viewport)
   */
  root?: Element | null
}

/** @public */
export interface ScrollSpyItem {
  id: string
  element: Element
}

export interface ScrollSpyReturn {
  /** Currently selected element ID */
  selectedId: Readonly<Ref<string | undefined>>

  /** Register an element to track */
  register: (id: string, element: Element) => void

  /** Unregister an element */
  unregister: (id: string) => void

  /** Clear all tracked elements */
  clear: () => void

  /** Number of tracked elements */
  size: Readonly<Ref<number>>
}

/**
 * Creates a scroll spy instance that tracks which element is currently
 * in the active viewport zone.
 *
 * @param options Configuration options
 * @returns Scroll spy controls and state
 *
 * @example
 * ```ts
 * const { selectedId, register, clear } = useScrollSpy()
 *
 * // Register elements to track
 * register('section-1', document.getElementById('section-1'))
 * register('section-2', document.getElementById('section-2'))
 *
 * // selectedId.value will update as user scrolls
 * watch(selectedId, (id) => console.log('Selected section:', id))
 * ```
 */
export function useScrollSpy (options: ScrollSpyOptions = {}): ScrollSpyReturn {
  const {
    rootMargin = '0px 0px -80% 0px',
    threshold = 0,
    root = null,
  } = options

  const selectedId = shallowRef<string>()
  const elements = shallowReactive(new Map<string, Element>())
  const observers = new Map<string, ReturnType<typeof useIntersectionObserver>>()

  const size = computed(() => elements.size)

  function register (id: string, element: Element) {
    if (!IN_BROWSER) return
    if (elements.has(id)) {
      unregister(id)
    }

    elements.set(id, element)

    const elementRef = shallowRef(element)
    const observer = useIntersectionObserver(
      elementRef,
      entries => {
        const entry = entries.at(-1)
        if (entry?.isIntersecting) {
          selectedId.value = id
        }
      },
      { rootMargin, threshold, root },
    )

    observers.set(id, observer)
  }

  function unregister (id: string) {
    const observer = observers.get(id)
    if (observer) {
      observer.stop()
      observers.delete(id)
    }
    elements.delete(id)

    if (selectedId.value === id) {
      selectedId.value = undefined
    }
  }

  function clear () {
    for (const id of elements.keys()) {
      unregister(id)
    }
  }

  onScopeDispose(clear)

  return {
    selectedId,
    register,
    unregister,
    clear,
    size,
  }
}
