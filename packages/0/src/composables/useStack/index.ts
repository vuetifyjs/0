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
 *
 * @example
 * ```ts
 * import { useStack } from '@vuetify/v0'
 *
 * const stack = useStack()
 * const ticket = stack.register({ onDismiss: () => console.log('dismissed') })
 * ticket.select()
 * ```
 */

// Composables
import { useContext } from '#v0/composables/createContext'
import { createPlugin } from '#v0/composables/createPlugin'
import { createSelection } from '#v0/composables/createSelection'
import { createTrinity } from '#v0/composables/createTrinity'

// Transformers
import { toElement } from '#v0/composables/toElement'

// Utilities
import { instanceExists, useId } from '#v0/utilities'
import { onScopeDispose, toRef, toValue } from 'vue'

// Types
import type { SelectionContext, SelectionOptions, SelectionTicket, SelectionTicketInput } from '#v0/composables/createSelection'
import type { ContextTrinity } from '#v0/composables/createTrinity'
import type { App, ComputedRef, MaybeRefOrGetter, Ref } from 'vue'

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
  /**
   * Whether this overlay should be backed by a scrim/backdrop
   *
   * @default true
   * @remarks When false, the overlay still participates in z-index stacking
   * but `Scrim` skips rendering a backdrop for it. Use for non-modal overlays
   * (snackbars, toasts, tooltips) that need layering without dimming.
   */
  scrim?: boolean
  /**
   * The overlay's DOM element.
   *
   * @remarks When set, the stack can expose this element as a top-layer teleport
   * target via {@link StackContext.topElement}. Native modal dialogs pass their
   * `<dialog>` element so non-modal overlays (snackbars) can teleport into them.
   *
   * @example
   * ```ts
   * stack.register({ el: () => dialogRef.value?.element })
   * ```
   */
  el?: MaybeRefOrGetter<Element | null | undefined>
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
   * Whether this overlay is backed by a scrim/backdrop
   */
  scrim: boolean
  /** The overlay's DOM element, if provided at registration. */
  el?: MaybeRefOrGetter<Element | null | undefined>
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
   * Element of the topmost selected modal overlay that has a resolvable DOM
   * element (a top-layer `<dialog>`), or `null`.
   *
   * @remarks Overlays that must appear above a modal (snackbars, tooltips)
   * teleport into this element so they share its top-layer context and remain
   * interactive. Non-modal (`scrim: false`) tickets are never returned, so a
   * non-modal overlay never resolves to itself.
   *
   * **One-tick window.** When a modal mounts already-open (`modelValue=true`),
   * the ticket's `select()` fires synchronously in the `immediate: true` watch
   * before the content ref resolves, so `topElement` is `null` for one tick.
   * Consumers that read `topElement` reactively (e.g. `Portal` resolving its
   * teleport target) see the correct element on the next tick after the
   * modal's DOM node mounts.
   *
   * @example
   * ```ts
   * const to = toRef(() => stack.topElement.value ?? 'body')
   * ```
   */
  topElement: Readonly<Ref<Element | null>>
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
export function createStack (_options: StackOptions = {}): StackContext {
  const {
    baseZIndex = 2000,
    increment = 10,
    ...options
  } = _options

  const selection = createSelection<StackTicketInput, StackTicket>({
    ...options,
    multiple: true,
  })

  // Non-modal overlays (scrim: false — snackbars, toasts) still stack for
  // z-index but must not count as an active modal: isActive/top/scrimZIndex/
  // isBlocking drive backdrop + scroll-lock, which a toast must never trigger.
  function selectedScrims () {
    return Array.from(selection.selectedIds)
      .map(id => selection.get(id) as StackTicket | undefined)
      .filter((ticket): ticket is StackTicket => !!ticket && ticket.scrim !== false)
  }

  const isActive = toRef(() => selectedScrims().length > 0)

  const top = toRef(() => selectedScrims().at(-1))

  const scrimZIndex = toRef(() => {
    const ticket = top.value
    return ticket ? ticket.zIndex.value - 1 : 0
  })

  const isBlocking = toRef(() => top.value?.blocking ?? false)

  const topElement = toRef(() => {
    const scrims = selectedScrims()
    for (let i = scrims.length - 1; i >= 0; i--) {
      const el = toElement(toValue(scrims[i].el))
      if (el) return el
    }
    return null
  })

  function ids () {
    return Array.from(selection.selectedIds)
  }

  function register (input: Partial<StackTicketInput> = {} as Partial<StackTicketInput>): StackTicket {
    const id = input.id ?? useId()
    const blocking = input.blocking ?? false
    const scrim = input.scrim ?? true
    const onDismiss = input.onDismiss

    const zIndex = toRef(() => {
      const position = ids().indexOf(id)
      if (position === -1) return baseZIndex
      return baseZIndex + position * increment
    })

    const globalTop = toRef(() => {
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
      scrim,
      onDismiss,
      zIndex,
      globalTop,
      dismiss,
      ...input,
      id,
    } as Partial<StackTicketInput>)

    // Auto-cleanup when called within component setup
    if (instanceExists()) {
      onScopeDispose(() => {
        selection.unregister(id)
      }, true)
    }

    return ticket as StackTicket
  }

  return {
    ...selection,
    register,
    isActive,
    top,
    scrimZIndex,
    isBlocking,
    topElement,
    get size () {
      return selection.size
    },
  } as StackContext
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
export function createStackContext (_options: StackContextOptions = {}): ContextTrinity<StackContext> {
  const { namespace = 'v0:stack', ...options } = _options
  const context = createStack(options)

  return createTrinity<StackContext>(namespace, context)
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
export function createStackPlugin (_options: StackPluginOptions = {}) {
  const { namespace = 'v0:stack', ...options } = _options
  const [, provideStackContext, context] = createStackContext({ ...options, namespace })

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
export function useStack (namespace = 'v0:stack'): StackContext {
  const fallback = getStackFallback()

  if (!instanceExists()) return fallback

  try {
    return useContext<StackContext>(namespace)
  } catch {
    return fallback
  }
}
