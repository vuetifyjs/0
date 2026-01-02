/**
 * Shiki transformer that detects component/composable names in code
 * and wraps them with data attributes for hover popovers.
 *
 * Marks potential API references at build time. Client-side component
 * validates against actual API data and handles display.
 */

// Types
import type { ShikiTransformer } from 'shiki'

// Component pattern: Namespace.Part (e.g., Popover.Root, Step.Item)
// Tokens come through as combined strings like "Popover.Root"
const COMPONENT_PATTERN = /^([A-Z][a-z]+)\.([A-Z][a-z]+)$/

// Composables: use* or create* patterns
const COMPOSABLE_PATTERN = /^(?:use|create)[A-Z][a-zA-Z]+$/

/**
 * Creates a Shiki transformer that marks potential API tokens.
 *
 * Components: Detects "Namespace.Part" patterns (e.g., Popover.Root)
 * Composables: Detects use* or create* patterns
 *
 * Client-side validation happens in DocsApiHover.vue
 */
export function createApiTransformer (): ShikiTransformer {
  return {
    name: 'api-hover',

    span (node) {
      // Only process text nodes within spans (tokens)
      if (!node.children || node.children.length !== 1) return
      const child = node.children[0]
      if (child.type !== 'text') return

      const text = child.value.trim()
      if (!text) return

      // Check for component pattern (e.g., "Popover.Root")
      const componentMatch = text.match(COMPONENT_PATTERN)
      if (componentMatch) {
        node.properties = node.properties || {}
        node.properties['data-api-candidate'] = text
        node.properties['data-api-type'] = 'component'
        return
      }

      // Check for composable pattern
      if (COMPOSABLE_PATTERN.test(text)) {
        node.properties = node.properties || {}
        node.properties['data-api-candidate'] = text
        node.properties['data-api-type'] = 'composable'
      }
    },
  }
}
