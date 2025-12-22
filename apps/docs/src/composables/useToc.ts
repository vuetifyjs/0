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

// Types
import type { Ref } from 'vue'
// Globals
import { IN_BROWSER } from '@vuetify/v0/constants'

// Utilities
import { nextTick, onScopeDispose, shallowRef, watch } from 'vue'

import { useRoute } from 'vue-router'

// Composables
import { useScrollSpy } from './useScrollSpy'

export interface TocHeading {
  id: string
  text: string
  level: 2 | 3
  children: TocHeading[]
}

export interface UseTocOptions {
  /**
   * CSS selector for heading elements.
   * @default 'h2[id], h3[id]'
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
    selector = 'h2[id], h3[id]',
    container = IN_BROWSER ? document : undefined,
  } = options

  const route = useRoute()
  const headings = shallowRef<TocHeading[]>([])
  const scrollSpy = useScrollSpy()

  let scanTimeoutId: ReturnType<typeof setTimeout> | null = null
  let scanRafId: number | null = null

  function scan () {
    if (!IN_BROWSER || !container) return

    scrollSpy.clear()

    const elements = container.querySelectorAll(selector)
    const result: TocHeading[] = []
    let currentH2: TocHeading | null = null

    for (const el of elements) {
      const id = el.id
      const text = el.textContent?.trim() ?? ''
      const level = el.tagName === 'H2' ? 2 : 3

      if (!id || !text) continue

      scrollSpy.register(id, el)

      const heading: TocHeading = { id, text, level, children: [] }

      if (level === 2) {
        result.push(heading)
        currentH2 = heading
      } else if (level === 3) {
        if (currentH2) {
          currentH2.children.push(heading)
        } else {
          // h3 without preceding h2, treat as top-level
          result.push(heading)
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

  function scrollTo (id: string) {
    if (!IN_BROWSER) return

    const el = document.querySelector(`#${CSS.escape(id)}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
      // Update URL hash without triggering scroll
      history.replaceState(null, '', `#${id}`)
    }
  }

  watch(
    () => route.path,
    () => {
      if (!IN_BROWSER) return
      nextTick(debouncedScan)
    },
    { immediate: true },
  )

  // Cleanup pending operations on dispose
  onScopeDispose(() => {
    if (scanTimeoutId) clearTimeout(scanTimeoutId)
    if (scanRafId) cancelAnimationFrame(scanRafId)
  })

  return {
    headings,
    selectedId: scrollSpy.selectedId,
    scrollTo,
  }
}
