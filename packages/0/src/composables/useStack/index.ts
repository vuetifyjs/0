/**
 * @module useStack
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-stack
 *
 * @remarks
 * Overlay z-index stacking composable with:
 * - Global reactive registry of active overlays
 * - Automatic z-index calculation based on selection order
 * - `globalTop` tracking - is this ticket topmost globally?
 * - Manual select/unselect for explicit control
 * - Auto-cleanup when registered within component setup
 *
 * Built on createSelection for consistent ticket-based management.
 */

// Foundational
import { createContext, useContext } from '#v0/composables/createContext'
import { createPlugin } from '#v0/composables/createPlugin'
import { createTrinity } from '#v0/composables/createTrinity'

// Composables
import { createSelection } from '#v0/composables/createSelection'

// Utilities
import { instanceExists, useId } from '#v0/utilities'
import { computed, onScopeDispose, toRef } from 'vue'

// Types
import type { SelectionContext, SelectionOptions, SelectionTicket, SelectionTicketInput } from '#v0/composables/createSelection'
import type { ContextTrinity } from '#v0/composables/createTrinity'
import type { App, ComputedRef, Ref } from 'vue'

/**
 * Input type for stack tickets - what users provide to register().
 */
export interface StackTicketInput extends SelectionTicketInput {
  /**
   * Callback invoked when the overlay should be dismissed
   *
   * @remarks Called by `ticket.dismiss()` or when scrim is clicked.
   * Typically sets isActive to false.
   */
  onDismiss?: () => void
  /**
   * Whether this overlay blocks scrim dismissal
   *
   * @default false
   * @remarks When true, clicking the scrim will not dismiss this overlay.
   * Use for critical dialogs requiring explicit user action.
   */
  blocking?: boolean
}

/**
 * Output type for stack tickets - what users receive from register().
 */
export type StackTicket<Z extends StackTicketInput = StackTicketInput> = SelectionTicket<Z> & {
  /**
   * Callback invoked when the overlay should be dismissed
   */
  onDismiss?: () => void
  /**
   * Whether this overlay blocks scrim dismissal
   */
  blocking: boolean
  /**
   * The calculated z-index for this overlay
   *
   * @remarks Automatically calculated based on selection order.
   * First selected overlay gets baseZIndex, each subsequent adds increment.
   */
  zIndex: ComputedRef<number>
  /**
   * Whether this overlay is the topmost in the global stack
   *
   * @remarks Useful for determining which overlay should handle
   * global keyboard events (e.g., Escape key).
   */
  globalTop: ComputedRef<boolean>
  /**
   * Dismiss this overlay
   *
   * @remarks If blocking is false, calls onDismiss callback and unselects.
   * If blocking is true, does nothing.
   */
  dismiss: () => void
}

/**
 * Context returned by createStack.
 */
export interface StackContext<
  Z extends StackTicketInput = StackTicketInput,
  E extends StackTicket<Z> = StackTicket<Z>,
> extends Omit<SelectionContext<Z, E>, 'register'> {
  /**
   * Whether any overlays are selected (active)
   *
   * @remarks Reactive boolean for conditional scrim rendering.
   */
  isActive: Readonly<Ref<boolean>>
  /**
   * The topmost selected overlay ticket
   *
   * @remarks Access to the current top overlay for inspection.
   */
  top: Readonly<Ref<E | undefined>>
  /**
   * Z-index for the scrim (one below top overlay)
   *
   * @remarks Position scrim behind the topmost overlay but above all others.
   */
  scrimZIndex: Readonly<Ref<number>>
  /**
   * Whether the topmost overlay blocks scrim clicks
   *
   * @remarks When true, the topmost overlay has `blocking: true`
   * and scrim clicks should be ignored.
   */
  isBlocking: Readonly<Ref<boolean>>
  /**
   * Register an overlay ticket
   *
   * @param input Partial ticket data
   * @returns Stack ticket with z-index and top tracking
   *
   * @remarks When called within component setup, the ticket is automatically
   * unregistered when the component unmounts.
   */
  register: (input?: Partial<Z>) => E
}

export interface StackOptions extends SelectionOptions {
  /**
   * Base z-index when stack is empty
   *
   * @default 2000
   * @remarks First overlay receives this z-index.
   */
  baseZIndex?: number
  /**
   * Z-index increment between overlays
   *
   * @default 10
   * @remarks Gap between overlay z-indexes allows room for
   * overlay-internal elements (dropdowns, tooltips within dialogs).
   */
  increment?: number
}

export interface StackContextOptions extends StackOptions {
  namespace?: string
}

export interface StackPluginOptions extends StackContextOptions {}

/**
 * Creates a new stack instance for managing overlay z-indexes.
 *
 * @param options Configuration options
 * @returns Stack context with registry methods and scrim helpers
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-stack
 *
 * @example
 * ```ts
 * import { createStack } from '@vuetify/v0'
 *
 * const stack = createStack({ baseZIndex: 1000 })
 *
 * const ticket = stack.register({
 *   onDismiss: () => console.log('dismissed'),
 *   blocking: false,
 * })
 *
 * ticket.select()  // Activate overlay
 * console.log(ticket.zIndex.value)  // 1000
 *
 * ticket.unselect()  // Deactivate overlay
 * ```
 */
export function createStack<
  Z extends StackTicketInput = StackTicketInput,
  E extends StackTicket<Z> = StackTicket<Z>,
  R extends StackContext<Z, E> = StackContext<Z, E>,
> (_options: StackOptions = {}): R {
  const {
    baseZIndex = 2000,
    increment = 10,
    ...options
  } = _options

  const selection = createSelection<StackTicketInput, StackTicket>({
    ...options,
    multiple: true,
  })

  const isActive = toRef(() => selection.selectedIds.size > 0)

  const top = toRef(() => {
    const ids = Array.from(selection.selectedIds)
    if (ids.length === 0) return undefined
    return selection.get(ids.at(-1)!) as E | undefined
  })

  const scrimZIndex = toRef(() => {
    const ticket = top.value
    return ticket ? ticket.zIndex.value - 1 : 0
  })

  const isBlocking = toRef(() => top.value?.blocking ?? false)

  function ids () {
    return Array.from(selection.selectedIds)
  }

  function register (input: Partial<Z> = {} as Partial<Z>): E {
    const id = input.id ?? useId()
    const blocking = input.blocking ?? false
    const onDismiss = input.onDismiss

    const zIndex = computed(() => {
      const position = ids().indexOf(id)
      if (position === -1) return baseZIndex
      return baseZIndex + position * increment
    })

    const globalTop = computed(() => {
      const list = ids()
      if (list.length === 0) return false
      return list.at(-1) === id
    })

    function dismiss () {
      if (blocking) return
      onDismiss?.()
      selection.unselect(id)
    }

    const ticket = selection.register({
      blocking,
      onDismiss,
      zIndex,
      globalTop,
      dismiss,
      ...input,
      id,
    } as unknown as Partial<Z>)

    // Auto-cleanup when called within component setup
    if (instanceExists()) {
      onScopeDispose(() => {
        selection.unregister(id)
      }, true)
    }

    return ticket as unknown as E
  }

  return {
    ...selection,
    register,
    isActive,
    top,
    scrimZIndex,
    isBlocking,
    get size () {
      return selection.size
    },
  } as unknown as R
}

/**
 * Creates a stack context trinity for provide/inject usage.
 *
 * @param options Configuration options including namespace
 * @returns Trinity of [useStackContext, provideStackContext, context]
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-stack
 *
 * @example
 * ```ts
 * import { createStackContext } from '@vuetify/v0'
 *
 * const [useMyStack, provideMyStack, myStack] = createStackContext({
 *   namespace: 'my:stack',
 *   baseZIndex: 3000,
 * })
 *
 * // In parent component:
 * provideMyStack()
 *
 * // In child component:
 * const stack = useMyStack()
 * ```
 */
export function createStackContext<
  Z extends StackTicketInput = StackTicketInput,
  E extends StackTicket<Z> = StackTicket<Z>,
  R extends StackContext<Z, E> = StackContext<Z, E>,
> (_options: StackContextOptions = {}): ContextTrinity<R> {
  const { namespace = 'v0:stack', ...options } = _options
  const [useStackContext, _provideStackContext] = createContext<R>(namespace)
  const context = createStack<Z, E, R>(options)

  function provideStackContext (_context: R = context, app?: App): R {
    return _provideStackContext(_context, app)
  }

  return createTrinity<R>(useStackContext, provideStackContext, context)
}

/**
 * Creates a Vue plugin to provide stack context at app level.
 *
 * @param options Configuration options
 * @returns Vue plugin instance
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-stack
 *
 * @example
 * ```ts
 * import { createApp } from 'vue'
 * import { createStackPlugin } from '@vuetify/v0'
 *
 * const app = createApp(App)
 * app.use(createStackPlugin({ baseZIndex: 2000 }))
 * app.mount('#app')
 * ```
 */
export function createStackPlugin<
  Z extends StackTicketInput = StackTicketInput,
  E extends StackTicket<Z> = StackTicket<Z>,
  R extends StackContext<Z, E> = StackContext<Z, E>,
> (_options: StackPluginOptions = {}) {
  const { namespace = 'v0:stack', ...options } = _options
  const [, provideStackContext, context] = createStackContext<Z, E, R>({ ...options, namespace })

  return createPlugin({
    namespace,
    provide: (app: App) => {
      provideStackContext(context, app)
    },
  })
}

// Lazy singleton fallback for when no provider exists
let fallbackStack: StackContext | undefined

function getStackFallback (): StackContext {
  if (!fallbackStack) {
    fallbackStack = createStack()
  }
  return fallbackStack
}

/**
 * Returns the current stack context.
 *
 * @param namespace The namespace for the stack context. Defaults to 'v0:stack'.
 * @returns The stack context instance
 *
 * @remarks Falls back to an internal shared instance if no provider exists.
 * For SSR safety, use createStackPlugin to provide isolated context per app.
 *
 * Tickets registered within component setup are automatically unregistered
 * when the component is unmounted.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-stack
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { shallowRef, watch } from 'vue'
 *   import { useStack } from '@vuetify/v0'
 *
 *   const stack = useStack()
 *   const isOpen = shallowRef(false)
 *
 *   // Ticket is auto-cleaned up when component unmounts
 *   const ticket = stack.register({
 *     onDismiss: () => { isOpen.value = false },
 *   })
 *
 *   // Sync selection state with isOpen
 *   watch(isOpen, v => v ? ticket.select() : ticket.unselect())
 * </script>
 *
 * <template>
 *   <button @click="isOpen = true">Open</button>
 *   <div v-if="isOpen" :style="{ zIndex: ticket.zIndex.value }">
 *     <p>Dialog content</p>
 *     <button @click="ticket.dismiss()">Close</button>
 *   </div>
 * </template>
 * ```
 */
export function useStack<
  Z extends StackTicketInput = StackTicketInput,
  E extends StackTicket<Z> = StackTicket<Z>,
  R extends StackContext<Z, E> = StackContext<Z, E>,
> (namespace = 'v0:stack'): R {
  const fallback = getStackFallback() as unknown as R

  if (!instanceExists()) return fallback

  try {
    return useContext<R>(namespace)
  } catch {
    return fallback
  }
}
