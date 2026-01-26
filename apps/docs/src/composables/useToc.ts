/**
 * @module useToc
 *
 * @remarks
 * Table of Contents composable for the docs site.
 * Wrapper around useScrollSpy for heading navigation.
 *
 * Key features:
 * - Queries DOM for heading elements
 * - Builds hierarchical structure (h3s nested under h2s)
 * - Re-scans on route changes (debounced for performance)
 * - Provides smooth scroll navigation
 */

// Globals

// Framework
import { useBreakpoints, useMutationObserver, useWindowEventListener } from '@vuetify/v0'
import { IN_BROWSER } from '@vuetify/v0/constants'

// Composables
import { useScrollSpy } from './useScrollSpy'
import { useSettings } from './useSettings'

// Utilities
import { nextTick, onScopeDispose, shallowRef, toRef, watch, watchEffect } from 'vue'
import { useRoute } from 'vue-router'

// Types
import type { Ref } from 'vue'

export interface TocHeading {
  id: string
  text: string
  level: 2 | 3 | 4
  children: TocHeading[]
}

export interface UseTocOptions {
  /**
   * CSS selector for heading elements.
   * @default 'h2[id], h3[id], h4[id]'
   */
  selector?: string

  /**
   * Container element to search within.
   * @default document
   */
  container?: Element | Document
}

export interface UseTocReturn {
  /** Hierarchical list of headings */
  headings: Readonly<Ref<TocHeading[]>>

  /** Currently selected heading ID */
  selectedId: Readonly<Ref<string | undefined>>

  /** Smooth scroll to a heading */
  scrollTo: (id: string) => void
}

/**
 * Creates a table of contents instance for the current page.
 *
 * @param options Configuration options
 * @returns TOC state and controls
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { useToc } from '@/composables/useToc'
 *
 * const { headings, selectedId, scrollTo } = useToc()
 * </script>
 *
 * <template>
 *   <nav>
 *     <ul>
 *       <li
 *         v-for="h in headings"
 *         :key="h.id"
 *         :class="{ active: h.id === selectedId }"
 *         @click="scrollTo(h.id)"
 *       >
 *         {{ h.text }}
 *       </li>
 *     </ul>
 *   </nav>
 * </template>
 * ```
 */
export function useToc (options: UseTocOptions = {}): UseTocReturn {
  const {
    selector = 'h2[id]:not([data-discovery-title]), h3[id]:not([data-discovery-title]), h4[id]:not([data-discovery-title])',
    container = IN_BROWSER ? document : undefined,
  } = options

  const route = useRoute()
  const headings = shallowRef<TocHeading[]>([])
  const scrollSpy = useScrollSpy()
  const breakpoints = useBreakpoints()
  const { prefersReducedMotion } = useSettings()

  let scanTimeoutId: ReturnType<typeof setTimeout> | null = null
  let scanRafId: number | null = null

  function scan () {
    if (!IN_BROWSER || !container) return

    scrollSpy.clear()

    const elements = container.querySelectorAll(selector)
    const result: TocHeading[] = []
    let currentH2: TocHeading | null = null
    let currentH3: TocHeading | null = null

    for (const el of elements) {
      const id = el.id
      const text = el.textContent?.trim() ?? ''
      const level = el.tagName === 'H2' ? 2 : (el.tagName === 'H3' ? 3 : 4)

      if (!id || !text) continue

      scrollSpy.register(id, el)

      const heading: TocHeading = { id, text, level, children: [] }

      switch (level) {
        case 2: {
          result.push(heading)
          currentH2 = heading
          currentH3 = null
          break
        }
        case 3: {
          if (currentH2) {
            currentH2.children.push(heading)
          } else {
            // h3 without preceding h2, treat as top-level
            result.push(heading)
          }
          currentH3 = heading
          break
        }
        case 4: {
          if (currentH3) {
            currentH3.children.push(heading)
          } else if (currentH2) {
            currentH2.children.push(heading)
          } else {
            result.push(heading)
          }
          break
        }
      }
    }

    headings.value = result
  }

  /**
   * Debounced scan that waits for DOM to settle before scanning.
   * Cancels any pending scan when called again.
   */
  function debouncedScan () {
    // Cancel any pending scan
    if (scanTimeoutId) {
      clearTimeout(scanTimeoutId)
      scanTimeoutId = null
    }
    if (scanRafId) {
      cancelAnimationFrame(scanRafId)
      scanRafId = null
    }

    // Wait for next tick, then use rAF for optimal timing
    scanTimeoutId = setTimeout(() => {
      scanRafId = requestAnimationFrame(scan)
    }, 50)
  }

  // Prevents hash sync during programmatic scrolls and initial load
  const isSyncing = shallowRef(false)
  const isInitialLoad = shallowRef(true)
  let initialLoadTimeoutId: ReturnType<typeof setTimeout> | null = null

  // Allow hash sync after initial scroll settles
  if (IN_BROWSER) {
    initialLoadTimeoutId = setTimeout(() => {
      isInitialLoad.value = false
    }, 500)
  }

  function scrollTo (id: string) {
    if (!IN_BROWSER) return

    const el = document.querySelector(`#${CSS.escape(id)}`)
    if (!el) return

    // Use instant scroll on initial load to avoid scroll spy catching intermediate headings
    const behavior = prefersReducedMotion.value || isInitialLoad.value ? 'auto' : 'smooth'

    isSyncing.value = true
    el.scrollIntoView({ behavior })
    history.replaceState(history.state, '', `#${id}`)

    if (behavior === 'auto') {
      nextTick(() => {
        isSyncing.value = false
      })
    } else {
      useWindowEventListener('scrollend', () => {
        isSyncing.value = false
      }, { once: true })
    }
  }

  // Sync URL hash on user scroll (disabled on mobile to prevent scroll issues)
  watchEffect(() => {
    if (isSyncing.value || isInitialLoad.value || breakpoints.isMobile.value) return

    const id = scrollSpy.selectedId.value
    if (id) {
      history.replaceState(history.state, '', `#${id}`)
    } else {
      history.replaceState(history.state, '', location.pathname + location.search)
    }
  })

  // Watch for route changes
  watch(
    () => route.path,
    () => {
      if (!IN_BROWSER) return
      nextTick(debouncedScan)
    },
    { immediate: true },
  )

  // Watch for dynamically added/removed headings (e.g., from async components like DocsApi)
  const observeTarget = toRef(() => {
    if (!IN_BROWSER || !container) return undefined
    return container instanceof Document ? container.body : container
  })

  useMutationObserver(observeTarget, mutations => {
    const hasHeadingChanges = mutations.some(m =>
      Array.from(m.addedNodes).some(
        node => node instanceof Element && (node.matches?.(selector) || node.querySelector?.(selector)),
      ) ||
      Array.from(m.removedNodes).some(
        node => node instanceof Element && (node.matches?.(selector) || node.querySelector?.(selector)),
      ),
    )
    if (hasHeadingChanges) debouncedScan()
  }, { childList: true, subtree: true })

  // Cleanup pending operations on dispose
  onScopeDispose(() => {
    if (scanTimeoutId) clearTimeout(scanTimeoutId)
    if (scanRafId) cancelAnimationFrame(scanRafId)
    if (initialLoadTimeoutId) clearTimeout(initialLoadTimeoutId)
  })

  return {
    headings,
    selectedId: scrollSpy.selectedId,
    scrollTo,
  }
}
