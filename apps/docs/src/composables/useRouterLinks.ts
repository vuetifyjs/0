/**
 * @module useRouterLinks
 *
 * @remarks
 * Intercepts clicks on internal links and routes them through Vue Router.
 * Prevents full page reloads for same-origin navigation in markdown content.
 *
 * Key features:
 * - Skips external links, file downloads, and new-tab links
 * - Handles paths with query strings and hash fragments
 * - Smooth scrolls to hash anchors (respects reduced motion preference)
 * - Automatically cleaned up on component unmount
 * - SSR-safe
 */

// Framework
import { useEventListener } from '@vuetify/v0'
import { IN_BROWSER } from '@vuetify/v0/constants'

// Composables
import { useSettings } from './useSettings'

// Utilities
import { useRouter } from 'vue-router'

// Types
import type { MaybeRefOrGetter } from 'vue'

/** File extensions that should trigger native download/navigation */
const DOWNLOAD_EXTENSIONS = /\.(pdf|zip|tar|gz|tgz|rar|7z|dmg|exe|msi|deb|rpm|apk|xlsx?|docx?|pptx?|csv|txt|json|xml|png|jpe?g|gif|svg|webp|ico|mp3|mp4|webm|ogg|wav|mov|avi)$/i

/**
 * Intercepts clicks on internal links within a container and uses
 * Vue Router for navigation instead of native browser navigation.
 *
 * @param container - The container element to listen for clicks on
 */
export function useRouterLinks (
  container: MaybeRefOrGetter<HTMLElement | null | undefined>,
) {
  if (!IN_BROWSER) return

  const router = useRouter()
  const { prefersReducedMotion } = useSettings()

  useEventListener(container, 'click', (e: MouseEvent) => {
    const anchor = (e.target as HTMLElement).closest('a')
    if (!anchor) return

    const href = anchor.getAttribute('href')
    if (!href) return

    // Skip: external links, file downloads, new tab links
    if (
      /^https?:\/\//i.test(href) ||
      DOWNLOAD_EXTENSIONS.test(href) ||
      anchor.hasAttribute('target')
    ) return

    // Hash-only link - smooth scroll to anchor
    if (href.startsWith('#') && !href.includes('/')) {
      const id = href.slice(1)
      const el = document.querySelector(`#${CSS.escape(id)}`)
      if (el) {
        e.preventDefault()
        el.scrollIntoView({ behavior: prefersReducedMotion.value ? 'auto' : 'smooth' })
        history.replaceState(null, '', href)
      }
      return
    }

    // Internal link - use router
    if (href.startsWith('/')) {
      e.preventDefault()
      router.push(href)
    }
  })
}
