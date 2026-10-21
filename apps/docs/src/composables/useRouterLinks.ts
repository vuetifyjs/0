/**
 * @module useRouterLinks
 *
 * @remarks
 * Intercepts clicks on internal links and routes them through Vue Router.
 * Prevents full page reloads for same-origin navigation in markdown content.
 *
 * Key features:
 * - Skips external links, same-origin demo apps, file downloads, and new-tab links
 * - Handles paths with query strings and hash fragments
 * - Smooth scrolls to hash anchors (respects reduced motion preference)
 * - A heading permalink (`.header-anchor`) copies its absolute URL and does not scroll
 * - Automatically cleaned up on component unmount
 * - SSR-safe
 */

// Framework
import { useEventListener } from '@vuetify/v0'
import { IN_BROWSER } from '@vuetify/v0/constants'

// Composables
import { useClipboard } from './useClipboard'
import { useSettings } from './useSettings'

// Utilities
import { onScopeDispose } from 'vue'
import { useRouter } from 'vue-router'

// Types
import type { MaybeRefOrGetter } from 'vue'

/** File extensions that should trigger native download/navigation */
const DOWNLOAD_EXTENSIONS = /\.(?:pdf|zip|tar|gz|tgz|rar|7z|dmg|exe|msi|deb|rpm|apk|xlsx?|docx?|pptx?|csv|txt|json|xml|png|jpe?g|gif|svg|webp|ico|mp3|mp4|webm|ogg|wav|mov|avi)$/i

const COPIED_MS = 2000

function isPlainClick (event: MouseEvent): boolean {
  return event.button === 0
    && !event.metaKey
    && !event.ctrlKey
    && !event.shiftKey
    && !event.altKey
}

function anchorUrl (href: string): string | undefined {
  try {
    return new URL(href, window.location.href).href
  } catch {
    return undefined
  }
}

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
  const clipboard = useClipboard(COPIED_MS)
  const { prefersReducedMotion } = useSettings()
  const copiedTimers = new Map<HTMLAnchorElement, ReturnType<typeof setTimeout>>()

  function markCopied (anchor: HTMLAnchorElement) {
    const pending = copiedTimers.get(anchor)
    if (pending) clearTimeout(pending)
    anchor.classList.add('header-anchor--copied')
    copiedTimers.set(anchor, setTimeout(() => {
      anchor.classList.remove('header-anchor--copied')
      copiedTimers.delete(anchor)
    }, COPIED_MS))

    const live = document.querySelector('#docs-copy-status')
    if (!live) return
    live.textContent = ''
    live.textContent = 'Link copied'
  }

  onScopeDispose(() => {
    for (const [anchor, timer] of copiedTimers) {
      clearTimeout(timer)
      anchor.classList.remove('header-anchor--copied')
    }
    copiedTimers.clear()
  })

  useEventListener(container, 'click', (e: MouseEvent) => {
    const anchor = (e.target as HTMLElement).closest('a')
    if (!anchor) return

    const href = anchor.getAttribute('href')
    if (!href) return

    // Skip: external links, same-origin demo apps, file downloads, new tab links
    if (
      /^https?:\/\//i.test(href) ||
      href.startsWith('/demo/') ||
      DOWNLOAD_EXTENSIONS.test(href) ||
      anchor.hasAttribute('target')
    ) return

    // Hash-only link. Heading permalinks copy the absolute URL and do not scroll.
    if (href.startsWith('#') && !href.includes('/')) {
      if (anchor.classList.contains('header-anchor')) {
        e.preventDefault()
        if (isPlainClick(e)) {
          const url = anchorUrl(href)
          if (url) {
            void clipboard.copy(url).then(ok => {
              if (ok) markCopied(anchor)
            })
          }
        }
        return
      }

      const id = href.slice(1)
      const el = document.querySelector(`#${CSS.escape(id)}`)
      if (el) {
        e.preventDefault()
        el.scrollIntoView({ behavior: prefersReducedMotion.value ? 'auto' : 'smooth' })
        history.replaceState(history.state, '', href)
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
