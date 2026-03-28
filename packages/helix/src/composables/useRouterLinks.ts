/**
 * @module useRouterLinks
 *
 * SPA link interception composable.
 * Intercepts clicks on internal `<a>` links within a container
 * to prevent full page loads, delegating navigation to a callback.
 *
 * SSR-safe, automatic cleanup on scope dispose.
 */

// Framework
import { IN_BROWSER, useEventListener } from '@vuetify/v0'

// Types
import type { MaybeRefOrGetter } from 'vue'

export interface UseRouterLinksOptions {
  /** Container element to listen for link clicks */
  container: MaybeRefOrGetter<Element | undefined>
  /** Callback invoked with the path for internal navigation */
  navigate: (path: string) => void
  /** Custom predicate to determine if a URL is internal. Default: same origin */
  isInternal?: (href: string) => boolean
}

function defaultIsInternal (href: string): boolean {
  if (!IN_BROWSER) return false
  try {
    const url = new URL(href, window.location.origin)
    return url.origin === window.location.origin
  } catch {
    return false
  }
}

/**
 * Intercepts clicks on internal `<a>` tags within a container
 * and calls a navigation callback instead of triggering a full page load.
 *
 * @example
 * ```ts
 * const content = useTemplateRef('content')
 *
 * useRouterLinks({
 *   container: content,
 *   navigate: (path) => router.push(path),
 * })
 * ```
 */
export function useRouterLinks (options: UseRouterLinksOptions): void {
  const { navigate, isInternal = defaultIsInternal } = options

  useEventListener(options.container as MaybeRefOrGetter<HTMLElement | undefined>, 'click', (event: MouseEvent) => {
    // Ignore modified clicks (new tab, etc.)
    if (event.defaultPrevented) return
    if (event.button !== 0) return
    if (event.metaKey || event.altKey || event.ctrlKey || event.shiftKey) return

    const link = (event.target as Element)?.closest?.('a')

    if (!link) return
    if (link.hasAttribute('download')) return
    if (link.target === '_blank') return

    const href = link.getAttribute('href')

    if (!href) return

    // Skip hash-only links
    if (href.startsWith('#')) return

    if (!isInternal(href)) return

    event.preventDefault()

    const url = new URL(href, window.location.origin)

    navigate(url.pathname + url.search + url.hash)
  })
}
