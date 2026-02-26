/**
 * @module useSelection
 *
 * @remarks
 * Base composable for managing selected items in a collection with Set-based tracking.
 *
 * Key features:
 * - Set-based selectedIds for O(1) selection checks
 * - Mandatory selection mode (prevents deselecting last item)
 * - Auto-enrollment option (selects non-disabled items on register)
 * - Disabled item filtering
 * - Computed selectedItems and selectedValues Sets
 *
 * Extends useRegistry and serves as the base for useSingle, useGroup, useStep, and useFeatures.
 */

// Foundational
import { createContext, useContext } from '#v0/composables/createContext'
import { createTrinity } from '#v0/composables/createTrinity'

// Composables
import { createRegistry } from '#v0/composables/createRegistry'

// Utilities
import { isUndefined, useId } from '#v0/utilities'
import { computed, shallowReactive, toRef, toValue } from 'vue'

// Types
import type { RegistryContext, RegistryOptions, RegistryTicket, RegistryTicketInput } from '#v0/composables/createRegistry'
import type { ContextTrinity } from '#v0/composables/createTrinity'
import type { ID } from '#v0/types'
import type { MaybeRefOrGetter, App, ComputedRef, MaybeRef, Reactive, Ref } from 'vue'

/**
 * Input type for selection tickets - what users provide to register().
 * Custom ticket types should extend this interface.
 *
 * @template V The type of the ticket value.
 *
 * @example
 * ```ts
 * interface MyTicket extends SelectionTicketInput {
 *   label: string
 *   disabled?: boolean
 *   metadata?: Record<string, unknown>
 * }
 *
 * const selection = createSelection<MyTicket>()
 * selection.register({ label: 'Item 1' })
 * ```
 */
export interface SelectionTicketInput<V = unknown> extends RegistryTicketInput<V> {
  /** Disabled state of the ticket (optional on input, defaults to false) */
  disabled?: MaybeRef<boolean>
}

/**
 * Output type for selection tickets - what users receive from get().
 * Includes registry-added methods for self-selection.
 *
 * @template Z The input ticket type that extends SelectionTicketInput.
 *
 * @remarks
 * The following properties are automatically added by the registry:
 * - `disabled` - Defaults to `false` if not provided
 * - `isSelected` - Reactive boolean indicating selection state
 * - `select()` - Method to select this ticket
 * - `unselect()` - Method to unselect this ticket
 * - `toggle()` - Method to toggle selection state
 */
export type SelectionTicket<Z extends SelectionTicketInput = SelectionTicketInput> = RegistryTicket & Z & {
  /** Disabled state of the ticket (guaranteed to exist on output) */
  disabled: MaybeRef<boolean>
  /** Whether the ticket is currently selected */
  isSelected: Readonly<Ref<boolean, boolean>>
  /** Select self */
  select: () => void
  /** Unselect self */
  unselect: () => void
  /** Toggle self on and off */
  toggle: () => void
}

/**
 * Context returned by createSelection.
 *
 * @template Z The input ticket type (what users provide to register).
 * @template E The output ticket type (what users receive from get). Defaults to SelectionTicket<Z>.
 */
export interface SelectionContext<
  Z extends SelectionTicketInput = SelectionTicketInput,
  E extends SelectionTicket<Z> = SelectionTicket<Z>,
> extends Omit<RegistryContext<E>, 'register' | 'onboard'> {
  /** Set of selected ticket IDs */
  selectedIds: Reactive<Set<ID>>
  /** Set of selected ticket instances */
  selectedItems: ComputedRef<Set<E>>
  /** Set of selected ticket values */
  selectedValues: ComputedRef<Set<unknown>>
  /** Disable state for the entire selection instance */
  disabled: MaybeRef<boolean>
  /** Clear all selected IDs and reindexes */
  reset: () => void
  /** Select a ticket by ID (Toggle ON) */
  select: (id: ID) => void
  /** Unselect a ticket by ID (Toggle OFF) */
  unselect: (id: ID) => void
  /** Toggles a ticket ON and OFF by ID */
  toggle: (id: ID) => void
  /** Check if a ticket is selected by ID */
  selected: (id: ID) => boolean
  /** Mandates selected ID based on "mandatory" Option */
  mandate: () => void
  /** Register a new ticket (accepts input type, returns output type) */
  register: (ticket?: Partial<Z>) => E
  /** Onboard multiple tickets at once */
  onboard: (registrations: Partial<Z>[]) => E[]
}

export interface SelectionOptions extends RegistryOptions {
  /** When true, the entire selection instance is disabled. */
  disabled?: MaybeRefOrGetter<boolean>
  /**
   * When true, newly registered items are automatically selected if not disabled.
   * Useful for pre-selecting items in multi-select scenarios.
   */
  enroll?: MaybeRefOrGetter<boolean>
  /**
   * Controls mandatory selection behavior:
   * - `false` (default): No mandatory selection enforcement
   * - `true`: Prevents deselecting the last selected item (user must always have one selected)
   * - `'force'`: Automatically selects the first non-disabled item on registration
   */
  mandatory?: MaybeRefOrGetter<boolean | 'force'>
  /** When true, treats the selection as an array */
  multiple?: MaybeRefOrGetter<boolean>
}

export interface SelectionContextOptions extends SelectionOptions {
  namespace?: string
}

/**
 * Creates a new selection instance for managing multiple selected items.
 *
 * Extends `useRegistry` with selection tracking via a reactive `Set` of selected IDs.
 * Supports disabled items, mandatory selection enforcement, and auto-enrollment.
 *
 * @param options The options for the selection instance.
 * @template Z The input ticket type - what users provide to register(). Extend SelectionTicketInput to add custom properties.
 * @template E The output ticket type - what users receive from get(). Automatically includes selection methods.
 * @template R The context type. Defaults to SelectionContext<Z, E>.
 * @returns A new selection instance with selection management methods.
 *
 * @remarks
 * **Key Features:**
 * - Multi-selection support (unlike `useSingle` which enforces single selection)
 * - Set-based `selectedIds` tracking for efficient lookups
 * - Computed `selectedItems` and `selectedValues` for reactive access
 * - Each ticket gets `isSelected`, `select()`, `unselect()`, and `toggle()` methods
 * - Disabled items cannot be selected
 * - Mandatory mode prevents deselecting the last item
 * - Force mode auto-selects first non-disabled item on registration
 * - Enroll option auto-selects all non-disabled items on registration
 *
 * **Inheritance Chain:**
 * `useRegistry` → `createSelection` → `createSingle`/`createGroup` → `createStep`
 *
 * @see https://0.vuetifyjs.com/composables/selection/use-selection
 *
 * @example
 * ```ts
 * import { createSelection } from '@vuetify/v0'
 *
 * // Basic usage
 * const selection = createSelection({ mandatory: true })
 *
 * selection.onboard([
 *   { id: 'item-1', value: 'Item 1' },
 *   { id: 'item-2', value: 'Item 2', disabled: true },
 *   { id: 'item-3', value: 'Item 3' },
 * ])
 *
 * selection.select('item-1')
 * selection.select('item-3')
 *
 * console.log(selection.selectedIds) // Set { 'item-1', 'item-3' }
 * console.log(Array.from(selection.selectedValues.value)) // ['Item 1', 'Item 3']
 * ```
 *
 * @example
 * ```ts
 * // With custom ticket type
 * interface MyTicket extends SelectionTicketInput {
 *   label: string
 *   icon?: string
 * }
 *
 * const tabs = createSelection<MyTicket>()
 *
 * tabs.register({ label: 'Home', icon: 'mdi-home' })
 * tabs.register({ label: 'Settings' })
 *
 * const ticket = tabs.get('...')
 * // ticket has: label, icon, isSelected, select(), unselect(), toggle()
 * ```
 */
export function createSelection<
  Z extends SelectionTicketInput = SelectionTicketInput,
  E extends SelectionTicket<Z> = SelectionTicket<Z>,
  R extends SelectionContext<Z, E> = SelectionContext<Z, E>,
> (_options: SelectionOptions = {}): R {
  const {
    disabled = false,
    enroll = false,
    mandatory = false,
    multiple = false,
    ...options
  } = _options
  const registry = createRegistry<E>(options)
  const selectedIds = shallowReactive(new Set<ID>())

  const selectedItems = computed(() => {
    return new Set(
      Array.from(selectedIds)
        .map(id => registry.get(id))
        .filter((item): item is E => !isUndefined(item)),
    )
  })

  const selectedValues = computed(() => {
    return new Set(
      Array.from(selectedItems.value).map(item => item.value),
    )
  })

  function seek (direction: 'first' | 'last' = 'first', from?: number): E | undefined {
    return registry.seek(direction, from, (ticket: E) => !toValue(ticket.disabled))
  }

  function mandate () {
    if (!toValue(mandatory) || registry.size === 0 || selectedIds.size > 0) return

    const ticket = seek('first')

    if (ticket) select(ticket.id)
  }

  function select (id: ID) {
    if (toValue(disabled)) return

    const item = registry.get(id)
    if (!item || toValue(item.disabled)) return

    if (!toValue(multiple)) selectedIds.clear()
    selectedIds.add(id)
  }

  function unselect (id: ID) {
    if (toValue(disabled)) return
    if (toValue(mandatory) && selectedIds.size === 1) return

    selectedIds.delete(id)
  }

  function toggle (id: ID) {
    if (toValue(disabled)) return

    if (selected(id)) unselect(id)
    else select(id)
  }

  function selected (id: ID) {
    return selectedIds.has(id)
  }

  function register (registration: Partial<Z> = {}): E {
    const id = registration.id ?? useId()
    const item: Partial<E> = {
      disabled: false,
      select: () => select(id),
      unselect: () => unselect(id),
      toggle: () => toggle(id),
      isSelected: toRef(() => selected(id)),
      ...registration,
      id,
    } as Partial<E>

    const ticket = registry.register(item)

    if (toValue(enroll) && !toValue(disabled) && !toValue(item.disabled)) select(ticket.id)
    if (toValue(mandatory) === 'force') mandate()

    return ticket
  }

  function unregister (id: ID) {
    selectedIds.delete(id)
    registry.unregister(id)
  }

  function offboard (ids: ID[]) {
    for (const id of ids) {
      selectedIds.delete(id)
    }
    registry.offboard(ids)
  }

  function onboard (registrations: Partial<Z>[]): E[] {
    const tickets = registry.batch(() => registrations.map(registration => register(registration)))
    if (toValue(mandatory) === 'force') mandate()
    return tickets
  }

  function reset () {
    registry.clear()
    selectedIds.clear()
    mandate()
  }

  return {
    ...registry,
    disabled,
    selectedIds,
    selectedItems,
    selectedValues,
    register,
    unregister,
    onboard,
    offboard,
    reset,
    mandate,
    seek,
    select,
    unselect,
    toggle,
    selected,
    get size () {
      return registry.size
    },
  } as R
}

/**
 * Creates a new selection context.
 *
 * @param options The options for the selection context.
 * @template Z The input ticket type - what users provide to register().
 * @template E The output ticket type - what users receive from get().
 * @template R The context type. Defaults to SelectionContext<Z, E>.
 * @returns A new selection context.
 *
 * @see https://0.vuetifyjs.com/composables/selection/use-selection
 *
 * @example
 * ```ts
 * import { createSelectionContext } from '@vuetify/v0'
 *
 * // With default namespace 'v0:selection'
 * export const [useCheckboxes, provideCheckboxes, checkboxes] = createSelectionContext()
 *
 * // Or with custom namespace
 * export const [useCheckboxes, provideCheckboxes, checkboxes] = createSelectionContext({ namespace: 'checkboxes' })
 *
 * // In a parent component:
 * provideCheckboxes()
 *
 * // In a child component:
 * const checkboxes = useCheckboxes()
 * checkboxes.select('checkbox-1')
 * ```
 *
 * @example
 * ```ts
 * // With custom ticket type
 * interface TabTicket extends SelectionTicketInput {
 *   label: string
 *   icon?: string
 * }
 *
 * export const [useTabs, provideTabs, tabs] = createSelectionContext<TabTicket>()
 * ```
 */
export function createSelectionContext<
  Z extends SelectionTicketInput = SelectionTicketInput,
  E extends SelectionTicket<Z> = SelectionTicket<Z>,
  R extends SelectionContext<Z, E> = SelectionContext<Z, E>,
> (_options: SelectionContextOptions = {}): ContextTrinity<R> {
  const { namespace = 'v0:selection', ...options } = _options
  const [useSelectionContext, _provideSelectionContext] = createContext<R>(namespace)
  const context = createSelection<Z, E, R>(options)

  function provideSelectionContext (_context: R = context, app?: App): R {
    return _provideSelectionContext(_context, app)
  }

  return createTrinity<R>(useSelectionContext, provideSelectionContext, context)
}

/**
 * Returns the current selection instance.
 *
 * @param namespace The namespace for the selection context. Defaults to `'v0:selection'`.
 * @template Z The input ticket type.
 * @template E The output ticket type.
 * @template R The context type.
 * @returns The current selection instance.
 *
 * @see https://0.vuetifyjs.com/composables/selection/use-selection
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { useSelection } from '@vuetify/v0'
 *
 *   const selection = useSelection()
 * </script>
 *
 * <template>
 *   <div>
 *     <p>Selected: {{ selection.selectedIds.size }}</p>
 *   </div>
 * </template>
 * ```
 */
export function useSelection<
  Z extends SelectionTicketInput = SelectionTicketInput,
  E extends SelectionTicket<Z> = SelectionTicket<Z>,
  R extends SelectionContext<Z, E> = SelectionContext<Z, E>,
> (namespace = 'v0:selection'): R {
  return useContext<R>(namespace)
}
