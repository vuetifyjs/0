/**
 * Shiki transformer that detects component/composable names in code
 * and wraps them with data attributes for hover popovers.
 *
 * Marks potential API references at build time. Client-side component
 * validates against actual API data and handles display.
 *
 * Component and composable whitelists are auto-generated from source
 * directories by generate-api-whitelist.ts at build time.
 */

// Types
import type { ShikiTransformer } from 'shiki'

// Auto-generated whitelists from packages/0/src/
import { V0_COMPONENTS, V0_COMPOSABLES } from './generated/api-whitelist'
// Vue API content - import only keys for build-time detection
import { VUE_API_CONTENT } from './vue-api-content'

// Component pattern: Namespace.Part (e.g., Popover.Root, ExpansionPanel.Item)
// Tokens come through as combined strings like "Popover.Root"
const COMPONENT_PATTERN = /^([A-Z][a-zA-Z]*)(?:\.([A-Z][a-zA-Z]*))?$/

// Trinity return values that map to their factory function
// createContext returns [useContext, provideContext]
// createPlugin returns [usePlugin, Plugin]
const TRINITY_RETURNS: Record<string, string> = {
  useContext: 'createContext',
  provideContext: 'createContext',
}

// Vue API names derived from vue-api-content.ts
// Used for build-time detection of Vue functions in code
const VUE_API_NAMES = new Set(Object.keys(VUE_API_CONTENT))

/**
 * Maps composable names to their canonical API page.
 * Returns the API name if valid, null otherwise.
 *
 * Patterns:
 * - createX -> createX (the canonical API page)
 * - useX -> createX (trinity return maps to factory)
 * - createXContext -> createX (variant maps to base)
 * - createXPlugin -> createX or useX (createStackPlugin -> createStack, createStoragePlugin -> useStorage)
 * - useContext/provideContext -> createContext (special trinity returns)
 */
function resolveComposable (name: string): { apiName: string } | null {
  // Check special trinity return values first (e.g., useContext -> createContext)
  const trinityParent = TRINITY_RETURNS[name]
  if (trinityParent) {
    return { apiName: trinityParent }
  }

  // Not in whitelist at all? Skip.
  if (!V0_COMPOSABLES.has(name)) {
    return null
  }

  // For useX, check if createX exists (trinity pattern)
  // useStack -> createStack, useGroup -> createGroup
  if (name.startsWith('use')) {
    const base = name.slice(3) // 'useStack' -> 'Stack'
    const createVersion = `create${base}`
    if (V0_COMPOSABLES.has(createVersion)) {
      return { apiName: createVersion }
    }
  }

  // For createXContext/createXPlugin, map to createX or useX
  // createStackPlugin -> createStack, createStoragePlugin -> useStorage
  if (name.startsWith('create')) {
    const withoutPrefix = name.slice(6) // 'createStackPlugin' -> 'StackPlugin'
    const base = withoutPrefix.replace(/(Plugin|Context)$/, '')
    if (base && base !== withoutPrefix) {
      // Try createX first (trinity factories)
      const createVersion = `create${base}`
      if (V0_COMPOSABLES.has(createVersion)) {
        return { apiName: createVersion }
      }
      // Fall back to useX (plugin composables like useStorage, useTheme)
      const useVersion = `use${base}`
      if (V0_COMPOSABLES.has(useVersion)) {
        return { apiName: useVersion }
      }
    }
  }

  // Direct match - use as-is (createX, toX, etc.)
  return { apiName: name }
}

/**
 * Creates a Shiki transformer that marks potential API tokens.
 *
 * Components: Detects "Namespace.Part" patterns (e.g., Popover.Root)
 * Composables: Detects use* or create* patterns
 * Vue built-ins: Links to Vue documentation
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

      const text = child.value
      if (!text) return

      const trimmed = text.trim()
      if (!trimmed) return

      // Determine if this is an API token (v0 component, v0 composable, or Vue API)
      let apiType: 'component' | 'composable' | 'vue' | null = null
      let apiName = trimmed

      // Check if it's a v0 composable (whitelist-based)
      const composable = resolveComposable(trimmed)
      if (composable) {
        apiType = 'composable'
        apiName = composable.apiName
      } else {
        // Check if it's a v0 component (namespace must be in whitelist)
        const match = COMPONENT_PATTERN.exec(trimmed)
        if (match && V0_COMPONENTS.has(match[1])) {
          apiType = 'component'
        } else if (VUE_API_NAMES.has(trimmed)) {
          // Check if it's a Vue API
          apiType = 'vue'
        }
      }

      // Nothing to mark
      if (!apiType) return

      // Extract leading/trailing whitespace
      const leadingWs = text.match(/^\s*/)?.[0] || ''
      const trailingWs = text.match(/\s*$/)?.[0] || ''

      // Build properties - all types now use data-api-candidate pattern
      const properties: Record<string, string> = {
        'data-api-candidate': trimmed,
        'data-api-name': apiName,
        'data-api-type': apiType,
      }

      // If no whitespace, simple case - just add attributes
      if (!leadingWs && !trailingWs) {
        node.properties = node.properties || {}
        Object.assign(node.properties, properties)
        return
      }

      // Has whitespace - restructure node to separate whitespace from API token
      // Create new children: [leading ws text] + [api span] + [trailing ws text]
      const newChildren: typeof node.children = []

      if (leadingWs) {
        newChildren.push({ type: 'text', value: leadingWs })
      }

      // Create inner span for the token
      newChildren.push({
        type: 'element',
        tagName: 'span',
        properties,
        children: [{ type: 'text', value: trimmed }],
      })

      if (trailingWs) {
        newChildren.push({ type: 'text', value: trailingWs })
      }

      node.children = newChildren
    },
  }
}

/**
 * Renders inline code for Vue API references.
 * Returns HTML string if text is a Vue API, null otherwise.
 */
export function renderVueApiInlineCode (
  text: string,
  escapeHtml: (s: string) => string,
): string | null {
  if (!VUE_API_NAMES.has(text)) return null
  const escaped = escapeHtml(text)
  return `<code data-api-candidate="${escaped}" data-api-name="${escaped}" data-api-type="vue">${escaped}</code>`
}

// Export for use in markdown.ts inline code processing
export { VUE_API_NAMES }

export { VUE_API_CONTENT } from './vue-api-content'
