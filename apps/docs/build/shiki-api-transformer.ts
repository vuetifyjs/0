/**
 * Shiki transformer that detects component/composable names in code
 * and wraps them with data attributes for hover popovers.
 *
 * Marks potential API references at build time. Client-side component
 * validates against actual API data and handles display.
 *
 * NOTE: This module is imported client-side, so no Node.js APIs allowed.
 * Lists must be manually maintained. Run `pnpm dev:docs` to verify new
 * composables/components get hover treatment.
 */

// Types
import type { ShikiTransformer } from 'shiki'

// Component pattern: Namespace.Part (e.g., Popover.Root, ExpansionPanel.Item)
// Tokens come through as combined strings like "Popover.Root"
const COMPONENT_PATTERN = /^([A-Z][a-zA-Z]*)(?:\.([A-Z][a-zA-Z]*))?$/

// v0 component namespaces - only these get API hover treatment
// Sync with: packages/0/src/components/
const V0_COMPONENTS = new Set([
  'Atom',
  'Avatar',
  'Checkbox',
  'Dialog',
  'ExpansionPanel',
  'Group',
  'Pagination',
  'Popover',
  'Selection',
  'Single',
  'Step',
])

// v0 composables with API entries
// Sync with: packages/0/src/composables/
const V0_COMPOSABLES = new Set([
  // Foundation
  'createContext',
  'createPlugin',
  'createTrinity',
  // Registration
  'createRegistry',
  'useQueue',
  'useTimeline',
  'useTokens',
  // Selection
  'createSelection',
  'createSingle',
  'createGroup',
  'createStep',
  // Forms
  'useForm',
  // Reactivity
  'useProxyModel',
  'useProxyRegistry',
  // System
  'useClickOutside',
  'useEventListener',
  'useHotkey',
  'useIntersectionObserver',
  'useMediaQuery',
  'useMutationObserver',
  'useResizeObserver',
  'useToggleScope',
  // Plugins
  'useBreakpoints',
  'useFeatures',
  'useHydration',
  'useLocale',
  'useLogger',
  'usePermissions',
  'useStorage',
  'useTheme',
  // Utilities
  'useFilter',
  'useOverflow',
  'usePagination',
  'useVirtual',
  // Transformers
  'toArray',
  'toReactive',
])

// Trinity return values that map to their factory function
// createContext returns [useContext, provideContext]
// createPlugin returns [usePlugin, Plugin]
const TRINITY_RETURNS: Record<string, string> = {
  useContext: 'createContext',
  provideContext: 'createContext',
}

/**
 * Maps create* variants to their parent use* composable.
 * Returns the composable name if valid, null otherwise.
 *
 * Patterns:
 * - createX -> useX (e.g., createGroup -> useGroup)
 * - createXContext -> useX (e.g., createGroupContext -> useGroup)
 * - createXPlugin -> useX (e.g., createThemePlugin -> useTheme)
 * - createFallbackX -> useX (e.g., createFallbackHydration -> useHydration)
 * - useContext/provideContext -> createContext (trinity returns)
 */
function resolveComposable (name: string): { apiName: string } | null {
  // Direct match - it's a known v0 composable
  if (V0_COMPOSABLES.has(name)) {
    return { apiName: name }
  }

  // Check trinity return values (e.g., useContext -> createContext)
  const trinityParent = TRINITY_RETURNS[name]
  if (trinityParent) {
    return { apiName: trinityParent }
  }

  // Try to map create* variants to their use* parent
  if (!name.startsWith('create')) return null

  // Remove 'create' prefix
  let base = name.slice(6) // 'createGroup' -> 'Group'

  // Handle suffixes: Plugin, Context, Fallback
  base = base.replace(/(Plugin|Context|Fallback)$/, '')

  // Handle special case: createFallbackX -> useX
  base = base.replace(/^Fallback/, '')

  if (!base) return null

  // Check if the create* version exists directly
  const createVersion = `create${base}`
  if (V0_COMPOSABLES.has(createVersion)) {
    return { apiName: createVersion }
  }

  // Check if the use* version exists
  const useVersion = `use${base}`
  if (V0_COMPOSABLES.has(useVersion)) {
    return { apiName: useVersion }
  }

  return null
}

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

      const text = child.value
      if (!text) return

      const trimmed = text.trim()
      if (!trimmed) return

      // Determine if this is an API token
      let apiType: 'component' | 'composable' | null = null
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
        }
      }

      if (!apiType) return

      // Extract leading/trailing whitespace
      const leadingWs = text.match(/^\s*/)?.[0] || ''
      const trailingWs = text.match(/\s*$/)?.[0] || ''

      // If no whitespace, simple case - just add attributes
      if (!leadingWs && !trailingWs) {
        node.properties = node.properties || {}
        node.properties['data-api-candidate'] = trimmed
        node.properties['data-api-name'] = apiName
        node.properties['data-api-type'] = apiType
        return
      }

      // Has whitespace - restructure node to separate whitespace from API token
      // Create new children: [leading ws text] + [api span] + [trailing ws text]
      const newChildren: typeof node.children = []

      if (leadingWs) {
        newChildren.push({ type: 'text', value: leadingWs })
      }

      // Create inner span for the API token
      newChildren.push({
        type: 'element',
        tagName: 'span',
        properties: {
          'data-api-candidate': trimmed,
          'data-api-name': apiName,
          'data-api-type': apiType,
        },
        children: [{ type: 'text', value: trimmed }],
      })

      if (trailingWs) {
        newChildren.push({ type: 'text', value: trailingWs })
      }

      node.children = newChildren
    },
  }
}
