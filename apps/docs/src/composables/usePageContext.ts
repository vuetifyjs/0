/**
 * @module usePageContext
 *
 * @remarks
 * Extracts context from the current documentation page for AI Q&A.
 * Gathers title, path, content text, and code examples.
 */

// Framework
import { IN_BROWSER } from '@vuetify/v0/constants'

// Utilities
import { computed, shallowRef } from 'vue'
import { useRoute } from 'vue-router'

// Types
import type { ComputedRef, InjectionKey, ShallowRef } from 'vue'

export interface PageContext {
  path: string
  title: string
  content: string
  examples: Record<string, string>
  frontmatter?: Record<string, unknown>
}

export interface UsePageContextReturn {
  /** Current page context */
  context: ComputedRef<PageContext>
  /** Register a code example (called by DocsExample) */
  registerExample: (name: string, code: string) => void
  /** Unregister a code example */
  unregisterExample: (name: string) => void
}

/** Injection key for example registry */
export const PageExamplesKey: InjectionKey<{
  register: (name: string, code: string) => void
  unregister: (name: string) => void
}> = Symbol('page-examples')

/**
 * Extracts context from the current documentation page.
 *
 * @returns Page context for AI Q&A
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { usePageContext } from '@/composables/usePageContext'
 *
 * const { context } = usePageContext()
 * </script>
 * ```
 */
export function usePageContext (): UsePageContextReturn {
  const route = useRoute()
  const examples: ShallowRef<Record<string, string>> = shallowRef({})

  function registerExample (name: string, code: string) {
    examples.value = { ...examples.value, [name]: code }
  }

  function unregisterExample (name: string) {
    const { [name]: _, ...rest } = examples.value
    examples.value = rest
  }

  const context = computed<PageContext>(() => {
    const path = route.path

    if (!IN_BROWSER) {
      return {
        path,
        title: '',
        content: '',
        examples: {},
      }
    }

    // Extract title from h1
    const h1 = document.querySelector('main h1')
    const title = h1?.textContent?.trim() || ''

    // Extract main content text (excluding code blocks for brevity)
    const main = document.querySelector(String.raw`main .max-w-\[688px\]`)
    let content = ''

    if (main) {
      // Clone to avoid modifying the DOM
      const clone = main.cloneNode(true) as HTMLElement

      // Remove code blocks (they're in examples)
      for (const el of clone.querySelectorAll('pre, .shiki')) el.remove()

      // Get text content
      content = clone.textContent?.trim() || ''

      // Normalize whitespace
      content = content.replace(/\s+/g, ' ').slice(0, 30_000)
    }

    return {
      path,
      title,
      content,
      examples: examples.value,
    }
  })

  return {
    context,
    registerExample,
    unregisterExample,
  }
}
