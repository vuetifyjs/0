// Factories
import { createContext } from '#v0/composables/createContext'
import { createTrinity } from '#v0/composables/createTrinity'

// Composables
import { useRegistry } from '#v0/composables/useRegistry'

// Utilities
import { computed, shallowReactive, toRef } from 'vue'
import { genId } from '#v0/utilities'

// Types
import type { App, ComputedRef, Reactive, Ref } from 'vue'
import type { RegistryContext, RegistryOptions, RegistryTicket } from '#v0/composables/useRegistry'
import type { ID } from '#v0/types'
import type { ContextTrinity } from '#v0/composables/createTrinity'

export interface SelectionTicket extends RegistryTicket {
  disabled: boolean
  isSelected: Readonly<Ref<boolean, boolean>>
  /** Select self */
  select: () => void
  /** Unselect self */
  unselect: () => void
  /** Toggle self on and off */
  toggle: () => void
}

export interface SelectionContext<Z extends SelectionTicket> extends RegistryContext<Z> {
  selectedIds: Reactive<Set<ID>>
  selectedItems: ComputedRef<Set<Z>>
  selectedValues: ComputedRef<Set<unknown>>
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
  /** When true, newly registered items are automatically selected if not disabled */
  enroll?: boolean
  mandatory?: boolean | 'force'
}

/**
 * Creates a selection context for managing collections of selectable items.
 * This function extends the registry functionality with selection state management.
 *
 * @param options Optional configuration for selection behavior.
 * @template Z The type of items managed by the selection.
 * @template E The type of the selection context.
 * @returns The selection context object.
 *
 * @see https://0.vuetifyjs.com/composables/selection/use-selection
 */
export function useSelection<
  Z extends SelectionTicket = SelectionTicket,
  E extends SelectionContext<Z> = SelectionContext<Z>,
> (options?: SelectionOptions): E {
  const registry = useRegistry<Z, E>(options)
  const selectedIds = shallowReactive(new Set<ID>())
  const enroll = options?.enroll ?? false
  const mandatory = options?.mandatory ?? false

  const selectedItems = computed(() => {
    return new Set(
      Array.from(selectedIds).map(id => registry.get(id)),
    )
  })

  const selectedValues = computed(() => {
    return new Set(
      Array.from(selectedItems.value).map(item => item?.value),
    )
  })

  function mandate () {
    if (!mandatory || registry.selectedIds.size > 0 || registry.size === 0) return

    select(registry.lookup(0)!)
  }

  function select (id: ID) {
    const item = registry.get(id)
    if (!item || item.disabled) return

    selectedIds.add(id)
  }

  function unselect (id: ID) {
    if (mandatory && selectedIds.size === 1) return

    selectedIds.delete(id)
  }

  function toggle (id: ID) {
    if (selectedIds.has(id)) unselect(id)
    else select(id)
  }

  function selected (id: ID) {
    return selectedIds.has(id)
  }

  function register (registration: Partial<Z> = {}): Z {
    const id = registration.id ?? genId()
    const item: Partial<Z> = {
      disabled: false,
      ...registration,
      id,
      isSelected: toRef(() => selectedIds.has(id)),
      select: () => select(id),
      unselect: () => unselect(id),
      toggle: () => toggle(id),
    }

    const ticket = registry.register(item) as Z

    if (enroll && !item.disabled) selectedIds.add(ticket.id)
    if (mandatory === 'force') mandate()

    return ticket
  }

  function unregister (id: ID) {
    selectedIds.delete(id)
    registry.unregister(id)
  }

  function reset () {
    registry.clear()
    registry.reindex()
    registry.mandate()
  }

  return {
    ...registry,
    selectedIds,
    selectedItems,
    selectedValues,
    register,
    unregister,
    reset,
    mandate,
    select,
    unselect,
    toggle,
    selected,
  } as E
}

/**
 * Creates a selection registry context with full injection/provision control.
 * Returns the complete trinity for advanced usage scenarios.
 *
 * @param namespace The namespace for the selection registry context
 * @param options Optional configuration for selection behavior.
 * @template Z The structure of the registry selection items.
 * @template E The available methods for the selection's context.
 * @returns A tuple containing the inject function, provide function, and the selection context.
 *
 * @see https://0.vuetifyjs.com/composables/selection/use-selection
 */
export function createSelectionContext<
  Z extends SelectionTicket = SelectionTicket,
  E extends SelectionContext<Z> = SelectionContext<Z>,
> (
  namespace: string,
  options?: SelectionOptions,
): ContextTrinity<E> {
  const [useSelectionContext, _provideSelectionContext] = createContext<E>(namespace)
  const context = useSelection<Z, E>(options)

  function provideSelectionContext (_context: E = context, app?: App): E {
    return _provideSelectionContext(_context, app)
  }

  return createTrinity<E>(useSelectionContext, provideSelectionContext, context)
}
