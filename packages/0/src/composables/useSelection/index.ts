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
import { useRegistry } from '#v0/composables/useRegistry'

// Utilities
import { genId, isUndefined } from '#v0/utilities'
import { computed, shallowReactive, toRef, toValue } from 'vue'

// Types
import type { ContextTrinity } from '#v0/composables/createTrinity'
import type { RegistryContext, RegistryOptions, RegistryTicket } from '#v0/composables/useRegistry'
import type { ID } from '#v0/types'
import type { App, ComputedRef, MaybeRef, Reactive, Ref } from 'vue'

export interface SelectionTicket<V = unknown> extends RegistryTicket<V> {
  /** Disabled state of the ticket */
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

export interface SelectionContext<Z extends SelectionTicket> extends RegistryContext<Z> {
  /** Set of selected ticket IDs */
  selectedIds: Reactive<Set<ID>>
  /** Set of selected ticket instances */
  selectedItems: ComputedRef<Set<Z>>
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
}

export interface SelectionOptions extends RegistryOptions {
  /** When true, the entire selection instance is disabled. */
  disabled?: MaybeRef<boolean>
  /**
   * When true, newly registered items are automatically selected if not disabled.
   * Useful for pre-selecting items in multi-select scenarios.
   */
  enroll?: boolean
  /**
   * Controls mandatory selection behavior:
   * - `false` (default): No mandatory selection enforcement
   * - `true`: Prevents deselecting the last selected item (user must always have one selected)
   * - `'force'`: Automatically selects the first non-disabled item on registration
   */
  mandatory?: boolean | 'force'
  /** When true, treats the selection as an array */
  multiple?: boolean
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
 * @template Z The type of the selection ticket.
 * @template E The type of the selection context.
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
 */
export function createSelection<
  Z extends SelectionTicket = SelectionTicket,
  E extends SelectionContext<Z> = SelectionContext<Z>,
> (_options: SelectionOptions = {}): E {
  const {
    disabled = false,
    enroll = false,
    mandatory = false,
    multiple = false,
    ...options
  } = _options
  const registry = useRegistry<Z, E>(options)
  const selectedIds = shallowReactive(new Set<ID>())

  const selectedItems = computed(() => {
    return new Set(
      Array.from(selectedIds)
        .map(id => registry.get(id))
        .filter((item): item is Z => !isUndefined(item)),
    )
  })

  const selectedValues = computed(() => {
    return new Set(
      Array.from(selectedItems.value).map(item => item.value),
    )
  })

  function seek (direction: 'first' | 'last' = 'first', from?: number): Z | undefined {
    return registry.seek(direction, from, (ticket: Z) => !toValue(ticket.disabled))
  }

  function mandate () {
    if (!mandatory || registry.size === 0 || selectedIds.size > 0) return

    const ticket = seek('first')

    if (ticket) select(ticket.id)
  }

  function select (id: ID) {
    if (toValue(disabled)) return

    const item = registry.get(id)
    if (!item || toValue(item.disabled)) return

    if (!multiple) selectedIds.clear()
    selectedIds.add(id)
  }

  function unselect (id: ID) {
    if (toValue(disabled)) return
    if (mandatory && selectedIds.size === 1) return

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

  function register (registration: Partial<Z> = {}): Z {
    const id = registration.id ?? genId()
    const item: Partial<Z> = {
      disabled: false,
      select: () => select(id),
      unselect: () => unselect(id),
      toggle: () => toggle(id),
      isSelected: toRef(() => selected(id)),
      ...registration,
      id,
    }

    const ticket = registry.register(item)

    if (enroll && !toValue(disabled) && !toValue(item.disabled)) selectedIds.add(ticket.id)
    if (mandatory === 'force') mandate()

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

  function onboard (registrations: Partial<Z>[]) {
    return registrations.map(registration => register(registration))
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
  } as E
}

/**
 * Creates a new selection context.
 *
 * @param options The options for the selection context.
 * @template Z The type of the selection ticket.
 * @template E The type of the selection context.
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
 */
export function createSelectionContext<
  Z extends SelectionTicket = SelectionTicket,
  E extends SelectionContext<Z> = SelectionContext<Z>,
> (_options: SelectionContextOptions = {}): ContextTrinity<E> {
  const { namespace = 'v0:selection', ...options } = _options
  const [useSelectionContext, _provideSelectionContext] = createContext<E>(namespace)
  const context = createSelection<Z, E>(options)

  function provideSelectionContext (_context: E = context, app?: App): E {
    return _provideSelectionContext(_context, app)
  }

  return createTrinity<E>(useSelectionContext, provideSelectionContext, context)
}

/**
 * Returns the current selection instance.
 *
 * @param namespace The namespace for the selection context. Defaults to `'v0:selection'`.
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
  Z extends SelectionTicket = SelectionTicket,
  E extends SelectionContext<Z> = SelectionContext<Z>,
> (namespace = 'v0:selection'): E {
  return useContext<E>(namespace)
}
