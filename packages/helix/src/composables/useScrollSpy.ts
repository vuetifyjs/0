/**
 * @module useScrollSpy
 *
 * Scroll spy composable that tracks which element is currently
 * in the active viewport zone using IntersectionObserver.
 *
 * Uses a single observer for all registered elements.
 * SSR-safe, automatic cleanup on scope dispose.
 */

// Framework
import { IN_BROWSER, isUndefined, useWindowEventListener } from '@vuetify/v0'

// Utilities
import { onScopeDispose, shallowReactive, shallowRef, toRef } from 'vue'

// Types
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

export interface ScrollSpyReturn {
  /** Currently active element ID */
  activeId: Readonly<Ref<string | undefined>>

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
 * Creates a scroll spy that tracks which element is currently
 * in the active viewport zone.
 *
 * Uses a single IntersectionObserver for all registered elements.
 *
 * @example
 * ```ts
 * const { activeId, register, unregister } = useScrollSpy()
 *
 * register('section-1', document.getElementById('section-1')!)
 * register('section-2', document.getElementById('section-2')!)
 *
 * watch(activeId, (id) => console.log('Active:', id))
 * ```
 */
export function useScrollSpy (options: ScrollSpyOptions = {}): ScrollSpyReturn {
  const {
    rootMargin = '0px 0px -80% 0px',
    threshold = 0,
    root = null,
  } = options

  const activeId = shallowRef<string>()
  const elements = shallowReactive(new Map<string, Element>())
  const elementToId = new WeakMap<Element, string>()

  const size = toRef(() => elements.size)

  let observer: IntersectionObserver | null = null
  const intersecting = new Set<Element>()

  function getObserver (): IntersectionObserver {
    if (observer) return observer

    observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            intersecting.add(entry.target)
          } else {
            intersecting.delete(entry.target)
          }
        }

        // Select the intersecting element highest on the page
        if (intersecting.size > 0) {
          let topmost: Element | null = null
          let topmostY = Infinity
          for (const el of intersecting) {
            const y = el.getBoundingClientRect().top
            if (y < topmostY) {
              topmostY = y
              topmost = el
            }
          }
          if (topmost) {
            const id = elementToId.get(topmost)
            if (id) activeId.value = id
          }
        }
      },
      { rootMargin, threshold, root },
    )

    return observer
  }

  function register (id: string, element: Element) {
    if (!IN_BROWSER) return

    if (elements.has(id)) {
      unregister(id)
    }

    elements.set(id, element)
    elementToId.set(element, id)
    getObserver().observe(element)
  }

  function unregister (id: string) {
    const element = elements.get(id)
    if (element) {
      observer?.unobserve(element)
      intersecting.delete(element)
      elementToId.delete(element)
    }
    elements.delete(id)

    if (activeId.value === id) {
      activeId.value = undefined
    }
  }

  function clear () {
    if (observer) {
      observer.disconnect()
      observer = null
    }
    for (const element of elements.values()) {
      elementToId.delete(element)
    }
    elements.clear()
    intersecting.clear()
    activeId.value = undefined
  }

  // Clear active state when scrolled to top
  useWindowEventListener('scroll', () => {
    if (window.scrollY === 0 && !isUndefined(activeId.value)) {
      activeId.value = undefined
    }
  }, { passive: true })

  onScopeDispose(clear)

  return {
    activeId,
    register,
    unregister,
    clear,
    size,
  }
}
