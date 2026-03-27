/**
 * @module useToc
 *
 * @remarks
 * Table of Contents composable that scans the DOM for headings
 * and builds a hierarchical structure.
 *
 * Key features:
 * - Queries DOM for heading elements within a container
 * - Builds hierarchical structure (h3s nested under h2s, h4s under h3s)
 * - Re-scans on DOM mutations (debounced)
 * - Provides smooth scroll navigation
 * - Integrates with useScrollSpy for active heading tracking
 */

// Framework
import { IN_BROWSER, useMutationObserver } from '@vuetify/v0'

// Composables
import { useScrollSpy } from './useScrollSpy'

// Utilities
import { nextTick, onScopeDispose, shallowRef, toRef, watch } from 'vue'

// Types
import type { MaybeRefOrGetter, Ref } from 'vue'

export interface TocHeading {
  id: string
  text: string
  level: 2 | 3 | 4
  children: TocHeading[]
}

export interface UseTocOptions {
  /**
   * Container element to search within.
   */
  container: MaybeRefOrGetter<Element | undefined>

  /**
   * CSS selector for heading elements.
   * @default 'h2[id], h3[id], h4[id]'
   */
  selector?: string
}

export interface UseTocReturn {
  /** Hierarchical list of headings */
  headings: Readonly<Ref<TocHeading[]>>

  /** Currently active heading ID */
  activeId: Readonly<Ref<string | undefined>>

  /** Smooth scroll to a heading */
  scrollTo: (id: string) => void
}

/**
 * Creates a table of contents instance by scanning a container for headings.
 *
 * @param options Configuration options
 * @returns TOC state and controls
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { useToc } from '@paper/codex'
 * import { useTemplateRef } from 'vue'
 *
 * const content = useTemplateRef('content')
 * const { headings, activeId, scrollTo } = useToc({ container: content })
 * </script>
 *
 * <template>
 *   <main ref="content">
 *     <h2 id="intro">Introduction</h2>
 *     <h2 id="usage">Usage</h2>
 *   </main>
 *
 *   <nav>
 *     <ul>
 *       <li
 *         v-for="h in headings"
 *         :key="h.id"
 *         :class="{ active: h.id === activeId }"
 *         @click="scrollTo(h.id)"
 *       >
 *         {{ h.text }}
 *       </li>
 *     </ul>
 *   </nav>
 * </template>
 * ```
 */
export function useToc (options: UseTocOptions): UseTocReturn {
  const {
    selector = 'h2[id], h3[id], h4[id]',
  } = options

  const container = toRef(options.container)
  const headings = shallowRef<TocHeading[]>([])
  const scrollSpy = useScrollSpy()

  let scanTimeoutId: ReturnType<typeof setTimeout> | null = null
  let scanRafId: number | null = null

  function scan () {
    if (!IN_BROWSER || !container.value) return

    scrollSpy.clear()

    const elements = container.value.querySelectorAll(selector)
    const result: TocHeading[] = []
    let currentH2: TocHeading | null = null
    let currentH3: TocHeading | null = null

    for (const el of elements) {
      if (el.closest('[role="dialog"]')) continue

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
    if (scanTimeoutId) {
      clearTimeout(scanTimeoutId)
      scanTimeoutId = null
    }
    if (scanRafId) {
      cancelAnimationFrame(scanRafId)
      scanRafId = null
    }

    scanTimeoutId = setTimeout(() => {
      scanTimeoutId = null
      scanRafId = requestAnimationFrame(scan)
    }, 50)
  }

  function scrollTo (id: string) {
    if (!IN_BROWSER) return

    const el = document.querySelector(`#${CSS.escape(id)}`)
    if (!el) return

    el.scrollIntoView({ behavior: 'smooth' })
  }

  // Scan when container becomes available or changes
  watch(container, value => {
    if (!value) return
    nextTick(debouncedScan)
  }, { immediate: true })

  // Watch for dynamically added/removed headings
  useMutationObserver(container, mutations => {
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

  onScopeDispose(() => {
    if (scanTimeoutId) clearTimeout(scanTimeoutId)
    if (scanRafId) cancelAnimationFrame(scanRafId)
    scanTimeoutId = null
    scanRafId = null
  })

  return {
    headings,
    activeId: scrollSpy.activeId,
    scrollTo,
  }
}
