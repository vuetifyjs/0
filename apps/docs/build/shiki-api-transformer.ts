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
  'Radio',
  'Selection',
  'Single',
  'Step',
  'Tabs',
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
  'useLazy',
  'useMediaQuery',
  'useMutationObserver',
  'useResizeObserver',
  'useToggleScope',
  // Plugins
  'useBreakpoints',
  'useDate',
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

// Vue 3 built-in functions mapped to their documentation URLs
// Keys are function names, values are full URLs to Vue docs
const VUE_FUNCTIONS: Record<string, string> = {
  // Reactivity: Core
  ref: 'https://vuejs.org/api/reactivity-core.html#ref',
  computed: 'https://vuejs.org/api/reactivity-core.html#computed',
  reactive: 'https://vuejs.org/api/reactivity-core.html#reactive',
  readonly: 'https://vuejs.org/api/reactivity-core.html#readonly',
  watch: 'https://vuejs.org/api/reactivity-core.html#watch',
  watchEffect: 'https://vuejs.org/api/reactivity-core.html#watcheffect',
  watchPostEffect: 'https://vuejs.org/api/reactivity-core.html#watchposteffect',
  watchSyncEffect: 'https://vuejs.org/api/reactivity-core.html#watchsynceffect',

  // Reactivity: Utilities
  isRef: 'https://vuejs.org/api/reactivity-utilities.html#isref',
  unref: 'https://vuejs.org/api/reactivity-utilities.html#unref',
  toRef: 'https://vuejs.org/api/reactivity-utilities.html#toref',
  toValue: 'https://vuejs.org/api/reactivity-utilities.html#tovalue',
  toRefs: 'https://vuejs.org/api/reactivity-utilities.html#torefs',
  isProxy: 'https://vuejs.org/api/reactivity-utilities.html#isproxy',
  isReactive: 'https://vuejs.org/api/reactivity-utilities.html#isreactive',
  isReadonly: 'https://vuejs.org/api/reactivity-utilities.html#isreadonly',

  // Reactivity: Advanced
  shallowRef: 'https://vuejs.org/api/reactivity-advanced.html#shallowref',
  triggerRef: 'https://vuejs.org/api/reactivity-advanced.html#triggerref',
  customRef: 'https://vuejs.org/api/reactivity-advanced.html#customref',
  shallowReactive: 'https://vuejs.org/api/reactivity-advanced.html#shallowreactive',
  shallowReadonly: 'https://vuejs.org/api/reactivity-advanced.html#shallowreadonly',
  toRaw: 'https://vuejs.org/api/reactivity-advanced.html#toraw',
  markRaw: 'https://vuejs.org/api/reactivity-advanced.html#markraw',
  effectScope: 'https://vuejs.org/api/reactivity-advanced.html#effectscope',
  getCurrentScope: 'https://vuejs.org/api/reactivity-advanced.html#getcurrentscope',
  onScopeDispose: 'https://vuejs.org/api/reactivity-advanced.html#onscopedispose',

  // Lifecycle Hooks
  onMounted: 'https://vuejs.org/api/composition-api-lifecycle.html#onmounted',
  onUpdated: 'https://vuejs.org/api/composition-api-lifecycle.html#onupdated',
  onUnmounted: 'https://vuejs.org/api/composition-api-lifecycle.html#onunmounted',
  onBeforeMount: 'https://vuejs.org/api/composition-api-lifecycle.html#onbeforemount',
  onBeforeUpdate: 'https://vuejs.org/api/composition-api-lifecycle.html#onbeforeupdate',
  onBeforeUnmount: 'https://vuejs.org/api/composition-api-lifecycle.html#onbeforeunmount',
  onErrorCaptured: 'https://vuejs.org/api/composition-api-lifecycle.html#onerrorcaptured',
  onRenderTracked: 'https://vuejs.org/api/composition-api-lifecycle.html#onrendertracked',
  onRenderTriggered: 'https://vuejs.org/api/composition-api-lifecycle.html#onrendertriggered',
  onActivated: 'https://vuejs.org/api/composition-api-lifecycle.html#onactivated',
  onDeactivated: 'https://vuejs.org/api/composition-api-lifecycle.html#ondeactivated',
  onServerPrefetch: 'https://vuejs.org/api/composition-api-lifecycle.html#onserverprefetch',

  // Dependency Injection
  provide: 'https://vuejs.org/api/composition-api-dependency-injection.html#provide',
  inject: 'https://vuejs.org/api/composition-api-dependency-injection.html#inject',
  hasInjectionContext: 'https://vuejs.org/api/composition-api-dependency-injection.html#hasinjectioncontext',

  // Setup Helpers
  defineProps: 'https://vuejs.org/api/sfc-script-setup.html#defineprops-defineemits',
  defineEmits: 'https://vuejs.org/api/sfc-script-setup.html#defineprops-defineemits',
  defineExpose: 'https://vuejs.org/api/sfc-script-setup.html#defineexpose',
  defineOptions: 'https://vuejs.org/api/sfc-script-setup.html#defineoptions',
  defineSlots: 'https://vuejs.org/api/sfc-script-setup.html#defineslots',
  defineModel: 'https://vuejs.org/api/sfc-script-setup.html#definemodel',
  withDefaults: 'https://vuejs.org/api/sfc-script-setup.html#default-props-values-when-using-type-declaration',
  useSlots: 'https://vuejs.org/api/sfc-script-setup.html#useslots-useattrs',
  useAttrs: 'https://vuejs.org/api/sfc-script-setup.html#useslots-useattrs',
  useTemplateRef: 'https://vuejs.org/api/composition-api-helpers.html#usetemplateref',
  useId: 'https://vuejs.org/api/composition-api-helpers.html#useid',
  useCssModule: 'https://vuejs.org/api/sfc-css-features.html#usecssmodule',

  // Render Function
  h: 'https://vuejs.org/api/render-function.html#h',
  mergeProps: 'https://vuejs.org/api/render-function.html#mergeprops',
  cloneVNode: 'https://vuejs.org/api/render-function.html#clonevnode',
  isVNode: 'https://vuejs.org/api/render-function.html#isvnode',
  resolveComponent: 'https://vuejs.org/api/render-function.html#resolvecomponent',
  resolveDirective: 'https://vuejs.org/api/render-function.html#resolvedirective',
  withDirectives: 'https://vuejs.org/api/render-function.html#withdirectives',
  withModifiers: 'https://vuejs.org/api/render-function.html#withmodifiers',

  // Custom Elements
  defineCustomElement: 'https://vuejs.org/api/custom-elements.html#definecustomelement',
  useHost: 'https://vuejs.org/api/custom-elements.html#usehost',
  useShadowRoot: 'https://vuejs.org/api/custom-elements.html#useshadowroot',

  // General
  defineComponent: 'https://vuejs.org/api/general.html#definecomponent',
  defineAsyncComponent: 'https://vuejs.org/api/general.html#defineasynccomponent',
  nextTick: 'https://vuejs.org/api/general.html#nexttick',

  // Application
  createApp: 'https://vuejs.org/api/application.html#createapp',
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

      // Determine if this is an API token (v0) or Vue built-in
      let apiType: 'component' | 'composable' | null = null
      let apiName = trimmed
      let vueHref: string | null = null

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
        } else {
          // Check if it's a Vue built-in function
          vueHref = VUE_FUNCTIONS[trimmed] || null
        }
      }

      // Nothing to mark
      if (!apiType && !vueHref) return

      // Extract leading/trailing whitespace
      const leadingWs = text.match(/^\s*/)?.[0] || ''
      const trailingWs = text.match(/\s*$/)?.[0] || ''

      // Build properties based on type
      const properties: Record<string, string> = vueHref
        ? { 'data-vue-href': vueHref, 'title': 'Open Vue documentation' }
        : {
            'data-api-candidate': trimmed,
            'data-api-name': apiName,
            'data-api-type': apiType!,
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

// Export for use in markdown.ts inline code processing
export { VUE_FUNCTIONS }
