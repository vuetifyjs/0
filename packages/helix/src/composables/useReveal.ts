/**
 * @module useReveal
 *
 * Scroll reveal animation composable.
 * Works with [data-reveal] CSS in tokens.css.
 * Uses IntersectionObserver to add `is-visible` class
 * with staggered delay when elements enter the viewport.
 *
 * SSR-safe, automatic cleanup on scope dispose.
 */

// Framework
import { IN_BROWSER } from '@vuetify/v0'

// Utilities
import { onMounted, onScopeDispose, toValue } from 'vue'

// Types
import type { MaybeRefOrGetter } from 'vue'

export interface UseRevealOptions {
  /** CSS selector to match reveal elements. Default: '[data-reveal]' */
  selector?: string
  /** IntersectionObserver threshold. Default: 0.1 */
  threshold?: number
  /** Delay in ms between staggered reveals. Default: 80 */
  stagger?: number
  /** Scroll container root element */
  root?: MaybeRefOrGetter<Element | undefined>
}

/**
 * Observes elements matching a selector and adds `is-visible`
 * class with staggered delay when they enter the viewport.
 *
 * @example
 * ```ts
 * // Reveal all [data-reveal] elements on scroll
 * useReveal()
 *
 * // Custom selector with scroll container
 * useReveal({
 *   selector: '.reveal',
 *   threshold: 0.2,
 *   stagger: 100,
 *   root: containerRef,
 * })
 * ```
 */
export function useReveal (options: UseRevealOptions = {}): void {
  if (!IN_BROWSER) return

  const {
    selector = '[data-reveal]',
    threshold = 0.1,
    stagger = 80,
  } = options

  let observer: IntersectionObserver | undefined
  let count = 0

  function onIntersect (entries: IntersectionObserverEntry[]) {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue

      const index = count++

      setTimeout(() => {
        ;(entry.target as HTMLElement).dataset.visible = ''
      }, index * stagger)

      observer?.unobserve(entry.target)
    }
  }

  onMounted(() => {
    const root = toValue(options.root)

    observer = new IntersectionObserver(onIntersect, {
      root: root ?? null,
      threshold,
    })

    const elements = document.querySelectorAll(selector)

    for (const el of elements) {
      observer.observe(el)
    }
  })

  onScopeDispose(() => {
    observer?.disconnect()
    observer = undefined
  })
}
