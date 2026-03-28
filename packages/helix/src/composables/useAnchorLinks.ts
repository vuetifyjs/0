/**
 * @module useAnchorLinks
 *
 * Deep linking to page sections with smooth scroll.
 * Handles URL hash changes and intercepts clicks on
 * internal #hash links for smooth scrolling behavior.
 *
 * SSR-safe, automatic cleanup on scope dispose.
 */

// Framework
import { IN_BROWSER, isElement, useEventListener, useWindowEventListener } from '@vuetify/v0'

// Utilities
import { onMounted } from 'vue'

export interface UseAnchorLinksOptions {
  /**
   * CSS selector to match anchor targets
   * @default '[id]'
   */
  selector?: string

  /**
   * Scroll offset in px (for fixed headers)
   * @default 0
   */
  offset?: number

  /**
   * Scroll behavior
   * @default 'smooth'
   */
  behavior?: ScrollBehavior
}

/**
 * Enables deep linking to page sections with smooth scroll.
 *
 * Intercepts clicks on internal `#hash` links and scrolls
 * smoothly to the target element. On mount, scrolls to the
 * current URL hash if present.
 *
 * @example
 * ```ts
 * // In a layout or page component
 * useAnchorLinks({ offset: 64 }) // 64px for fixed header
 * ```
 */
export function useAnchorLinks (options: UseAnchorLinksOptions = {}): void {
  if (!IN_BROWSER) return

  const {
    selector = '[id]',
    offset = 0,
    behavior = 'smooth',
  } = options

  function scrollTo (id: string) {
    const target = document.querySelector(`${selector}#${CSS.escape(id)}`)

    if (!isElement(target)) return

    const top = target.getBoundingClientRect().top + window.scrollY - offset

    window.scrollTo({ top, behavior })
  }

  function onHashChange () {
    const hash = window.location.hash.slice(1)

    if (hash) {
      scrollTo(hash)
    }
  }

  // Intercept clicks on internal hash links
  useEventListener(document, 'click', (event: MouseEvent) => {
    const link = (event.target as Element)?.closest?.('a[href^="#"]')

    if (!link) return

    const hash = link.getAttribute('href')?.slice(1)

    if (!hash) return

    event.preventDefault()
    history.pushState(null, '', `#${hash}`)
    scrollTo(hash)
  })

  // Handle browser back/forward with hash changes
  useWindowEventListener('hashchange', onHashChange)

  // Scroll to hash on mount
  onMounted(() => {
    const hash = window.location.hash.slice(1)

    if (hash) {
      // Defer to allow DOM to settle
      requestAnimationFrame(() => scrollTo(hash))
    }
  })
}
