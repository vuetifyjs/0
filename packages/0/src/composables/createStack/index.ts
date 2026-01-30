/**
 * @module createStack
 *
 * @see https://0.vuetifyjs.com/composables/plugins/create-stack
 *
 * @remarks
 * A composable for managing overlay z-index stacking with:
 * - Global reactive registry of active overlays
 * - Automatic z-index calculation (last + increment)
 * - `globalTop` tracking - is this overlay topmost globally?
 * - `localTop` tracking - does this overlay have no active children?
 * - Parent/child tracking via injection for nested overlays
 * - Automatic registration via `useToggleScope`
 * - SSR-safe with per-app isolation via plugin
 *
 * Built on createRegistry for consistent ticket-based management.
 */

import { createContext, createPlugin, createRegistry, createTrinity } from '#v0/composables'
import { IN_BROWSER } from '#v0/constants/globals'

// Composables
import { useToggleScope } from '#v0/composables/useToggleScope'

// Utilities
import { useId } from '#v0/utilities'
import {
  getCurrentInstance,
  inject,
  onScopeDispose,
  provide,
  readonly,
  shallowReactive,
  shallowRef,
  toRef,
  watchEffect,
} from 'vue'

// Types
import type { RegistryContext, RegistryTicket } from '#v0/composables/createRegistry'
import type { ID } from '#v0/types'
import type { App, InjectionKey, Ref, ShallowRef } from 'vue'

/**
 * Parent/child context for nested overlays.
 * Injected to track active children within a parent overlay.
 */
interface StackProvide {
  children: Set<ID>
}

const StackSymbol: InjectionKey<StackProvide> = Symbol.for('v0:stack')

/**
 * Stack ticket representing an active overlay in the z-index stack.
 */
export interface StackTicket extends RegistryTicket {
  /**
   * The calculated z-index for this overlay
   *
   * @remarks Automatically calculated based on position in stack. First overlay gets baseZIndex, each subsequent overlay adds increment.
   */
  zIndex: number
  /**
   * Callback invoked when the overlay should be dismissed
   *
   * @remarks Called by `stack.dismiss()` when scrim is clicked or programmatic dismiss is triggered. Typically sets isActive to false.
   */
  onDismiss?: () => void
  /**
   * Whether this overlay blocks scrim dismissal
   *
   * @default false
   * @remarks When true, clicking the scrim will not dismiss this overlay. Use for critical dialogs requiring explicit user action.
   */
  blocking?: boolean
}

export interface StackOptions {
  /**
   * Base z-index when stack is empty
   *
   * @default 2000
   * @remarks First overlay receives this z-index. Subsequent overlays add increment to the previous overlay's z-index.
   *
   * @example
   * ```ts
   * const { zIndex } = useStack(isOpen, { baseZIndex: 1000 })
   * // First overlay: 1000, second: 1010, etc.
   * ```
   */
  baseZIndex?: number
  /**
   * Z-index increment between overlays
   *
   * @default 10
   * @remarks Gap between overlay z-indexes allows room for overlay-internal elements (dropdowns, tooltips within dialogs).
   *
   * @example
   * ```ts
   * const { zIndex } = useStack(isOpen, { increment: 100 })
   * // First overlay: 2000, second: 2100, etc.
   * ```
   */
  increment?: number
  /**
   * Disable global stack participation
   *
   * @default false
   * @remarks When true, the overlay tracks parent/child relationships but doesn't register in the global stack. Useful for nested overlays that shouldn't affect global z-index or scrim.
   */
  disableGlobalStack?: boolean
  /**
   * Callback invoked when overlay should be dismissed
   *
   * @remarks Called by `stack.dismiss()` when scrim is clicked. Typically sets isActive to false.
   *
   * @example
   * ```ts
   * const isOpen = shallowRef(false)
   * const { styles } = useStack(isOpen, {
   *   onDismiss: () => { isOpen.value = false }
   * })
   * ```
   */
  onDismiss?: () => void
  /**
   * Whether this overlay blocks scrim dismissal
   *
   * @default false
   * @remarks When true, clicking the scrim will not dismiss this overlay. Use for critical dialogs requiring explicit user action.
   */
  blocking?: boolean
}

export interface StackReturn {
  /**
   * Whether this overlay is the topmost in the global stack
   *
   * @remarks Useful for determining which overlay should handle global keyboard events (e.g., Escape key).
   *
   * @example
   * ```ts
   * const { globalTop } = useStack(isOpen)
   *
   * useHotkey('Escape', () => {
   *   if (globalTop.value) close()
   * })
   * ```
   */
  globalTop: Readonly<ShallowRef<boolean>>
  /**
   * Whether this overlay has no active children
   *
   * @remarks True when no nested overlays are open within this overlay. Useful for determining if this overlay is the "active" one for keyboard navigation.
   */
  localTop: Readonly<ShallowRef<boolean>>
  /**
   * Computed styles object with z-index
   *
   * @remarks Bind directly to element style attribute for automatic z-index management.
   *
   * @example
   * ```vue
   * <template>
   *   <div v-if="isOpen" :style="styles" class="fixed inset-0">
   *     Modal content
   *   </div>
   * </template>
   * ```
   */
  styles: Readonly<Ref<{ readonly zIndex: number }>>
  /**
   * The calculated z-index value
   *
   * @remarks Direct access to the z-index number if styles object isn't suitable.
   */
  zIndex: Readonly<ShallowRef<number>>
  /**
   * Unique identifier for this stack entry
   *
   * @remarks Auto-generated ID used for registration tracking.
   */
  id: ID
}

/**
 * Register an overlay in the global z-index stack.
 *
 * @param isActive Reactive boolean controlling when this overlay is active
 * @param options Configuration for z-index, callbacks, and behavior
 * @returns Stack return object with reactive state and styles
 *
 * @see https://0.vuetifyjs.com/composables/plugins/create-stack#use-stack
 *
 * @example
 * ```vue
 * <script setup>
 *   import { shallowRef } from 'vue'
 *   import { useStack } from '@vuetify/v0'
 *
 *   const isOpen = shallowRef(false)
 *   const { styles, globalTop } = useStack(isOpen, {
 *     onDismiss: () => { isOpen.value = false }
 *   })
 * </script>
 *
 * <template>
 *   <div v-if="isOpen" :style="styles" class="fixed inset-0">
 *     Modal content
 *   </div>
 * </template>
 * ```
 */
export function useStack (
  isActive: Readonly<Ref<boolean>>,
  options: StackOptions = {},
): StackReturn {
  const {
    baseZIndex = 2000,
    increment = 10,
    disableGlobalStack = false,
    onDismiss,
    blocking = false,
  } = options

  const id = useId()
  const vm = getCurrentInstance()

  // Get parent context for nested overlays (only in component context)
  const parent = vm ? inject(StackSymbol, undefined) : undefined

  // Provide scope for children (only in component context)
  const scope: StackProvide = shallowReactive({
    children: new Set<ID>(),
  })
  if (vm) {
    provide(StackSymbol, scope)
  }

  const zIndex = shallowRef(baseZIndex)
  const globalTop = shallowRef(true)

  // Get registry from context (SSR-safe: each app gets its own registry)
  let registry: RegistryContext<StackTicket>
  try {
    registry = useStackContext().registry
  } catch {
    // Fallback for usage outside provided context (e.g., tests with effectScope)
    registry = stack.registry
  }

  useToggleScope(isActive, () => {
    // Calculate z-index based on current stack
    const last = registry.seek('last')
    zIndex.value = last ? last.zIndex + increment : baseZIndex

    if (!disableGlobalStack) {
      registry.register({
        id,
        zIndex: zIndex.value,
        onDismiss,
        blocking,
      })
    }

    // Register with parent if nested
    parent?.children.add(id)

    onScopeDispose(() => {
      if (!disableGlobalStack) {
        registry.unregister(id)
      }
      parent?.children.delete(id)
    })
  })

  // Track if this is the topmost overlay
  if (!disableGlobalStack) {
    let timeoutId: ReturnType<typeof setTimeout> | undefined

    watchEffect(() => {
      const top = registry.seek('last')
      const isTop = top?.id === id

      // Clear any pending timeout to prevent stale updates
      if (timeoutId) clearTimeout(timeoutId)

      if (IN_BROWSER) {
        // Browser: Delay globalTop update to next macrotask.
        // Synchronous updates during rapid open/close cause z-index to change
        // before DOM rendering completes, resulting in visual flash.
        timeoutId = setTimeout(() => {
          globalTop.value = isTop
        })
      } else {
        // SSR: Set immediately to avoid hydration mismatch
        globalTop.value = isTop
      }
    })

    onScopeDispose(() => {
      if (timeoutId) clearTimeout(timeoutId)
    })
  }

  const localTop = toRef(() => scope.children.size === 0)

  return {
    globalTop: readonly(globalTop),
    localTop: readonly(localTop),
    styles: readonly(toRef(() => ({ zIndex: zIndex.value }))),
    zIndex: readonly(zIndex),
    id,
  }
}

// ============================================================================
// Stack Context (for scrim integration)
// ============================================================================

export interface StackContext {
  /**
   * The global registry of active overlays
   *
   * @remarks Direct access to the underlying registry for advanced use cases. Prefer using context methods for most operations.
   */
  registry: RegistryContext<StackTicket>
  /**
   * Whether any overlays are active
   *
   * @remarks Reactive boolean for conditional scrim rendering.
   *
   * @example
   * ```vue
   * <template>
   *   <div v-if="stack.isActive.value" class="scrim" />
   * </template>
   * ```
   */
  isActive: Readonly<Ref<boolean>>
  /**
   * The topmost overlay entry
   *
   * @remarks Access to the current top overlay ticket for inspection.
   */
  top: Readonly<Ref<StackTicket | undefined>>
  /**
   * Z-index for the scrim (one below top overlay)
   *
   * @remarks Position scrim behind the topmost overlay but above all others.
   *
   * @example
   * ```vue
   * <template>
   *   <div
   *     v-if="stack.isActive.value"
   *     class="scrim"
   *     :style="{ zIndex: stack.scrimZIndex.value }"
   *   />
   * </template>
   * ```
   */
  scrimZIndex: Readonly<Ref<number>>
  /**
   * Whether the scrim should block clicks
   *
   * @remarks When true, the topmost overlay has `blocking: true` and scrim clicks should be ignored.
   */
  isBlocking: Readonly<Ref<boolean>>
  /**
   * Dismiss an overlay
   *
   * @param id Optional ID of specific overlay to dismiss. If omitted, dismisses topmost non-blocking overlay.
   * @remarks Calls the overlay's `onDismiss` callback if not blocking.
   *
   * @see https://0.vuetifyjs.com/composables/plugins/create-stack#dismiss
   *
   * @example
   * ```vue
   * <template>
   *   <div
   *     v-if="stack.isActive.value"
   *     class="scrim"
   *     :style="{ zIndex: stack.scrimZIndex.value }"
   *     @click="stack.dismiss()"
   *   />
   * </template>
   * ```
   */
  dismiss: (id?: ID) => void
}

/**
 * Create a stack context with its own registry.
 *
 * @param registry Optional registry instance. If not provided, creates a new reactive one.
 * @returns Stack context with reactive state and methods
 *
 * @remarks Used internally by the plugin. For manual context creation in advanced scenarios.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/create-stack#create-stack-context
 *
 * @example
 * ```ts
 * import { createStackContext, provideStackContext } from '@vuetify/v0'
 *
 * // Create and provide custom context
 * const context = createStackContext()
 * provideStackContext(context)
 * ```
 */
export function createStackContext (
  registry: RegistryContext<StackTicket> = createRegistry<StackTicket>({ reactive: true }),
): StackContext {
  const isActive = toRef(() => registry.size > 0)
  const top = toRef(() => registry.seek('last'))
  const scrimZIndex = toRef(() => {
    const top = registry.seek('last')
    return top ? top.zIndex - 1 : 0
  })
  const isBlocking = toRef(() => top.value?.blocking ?? false)

  function dismiss (id?: ID) {
    const ticket = id ? registry.get(id) : registry.seek('last')
    if (ticket?.blocking) return
    ticket?.onDismiss?.()
  }

  return {
    registry,
    isActive,
    top,
    scrimZIndex,
    isBlocking,
    dismiss,
  }
}

// ============================================================================
// Context Trinity
// ============================================================================

function createStackContextTrinity () {
  const [useStackContext, _provideStackContext] = createContext<StackContext>('v0:stack')
  const context = createStackContext()

  function provideStackContext (_context: StackContext = context, app?: App) {
    return _provideStackContext(_context, app)
  }

  return createTrinity(useStackContext, provideStackContext, context)
}

/**
 * Trinity exports for stack context.
 *
 * @remarks
 * - `useStackContext` - Get the current stack context (throws if not provided)
 * - `provideStackContext` - Provide stack context to component tree
 * - `stack` - Default global stack context instance
 */
export const [useStackContext, provideStackContext, stack] = createStackContextTrinity()

export interface StackPluginOptions {
  /**
   * Base z-index when stack is empty
   *
   * @default 2000
   */
  baseZIndex?: number
  /**
   * Z-index increment between overlays
   *
   * @default 10
   */
  increment?: number
}

/**
 * Creates a Vue plugin to provide stack context at app level.
 *
 * @param options Configuration options for the stack plugin
 * @returns Vue plugin instance
 *
 * @remarks Creates a fresh registry per app instance for SSR safety. Each app gets isolated overlay state.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/create-stack#create-stack-plugin
 *
 * @example
 * ```ts
 * import { createApp } from 'vue'
 * import { createStackPlugin } from '@vuetify/v0'
 *
 * const app = createApp(App)
 * app.use(createStackPlugin())
 * app.mount('#app')
 * ```
 */
export function createStackPlugin (_options: StackPluginOptions = {}) {
  return createPlugin({
    namespace: 'v0:stack',
    provide: app => {
      // Create fresh registry per app to avoid SSR state leakage
      const registry = createRegistry<StackTicket>({ reactive: true })
      provideStackContext(createStackContext(registry), app)
    },
  })
}
