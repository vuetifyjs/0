// Factories
import { createContext } from '#v0/factories/createContext'
import { createTrinity } from '#v0/factories/createTrinity'

// Composables
import { useSelection } from '#v0/composables/useSelection'

// Utilities
import { computed } from 'vue'

// Types
import type { ContextTrinity } from '#v0/factories/createTrinity'
import type { ID } from '#v0/types'
import type { ComputedRef } from 'vue'
import type { SelectionContext, SelectionOptions, SelectionTicket } from '#v0/composables/useSelection'

export interface SingleTicket extends SelectionTicket {}

export interface SingleContext<Z extends SingleTicket> extends SelectionContext<Z> {
  selectedId: ComputedRef<ID | undefined>
  selectedIndex: ComputedRef<number>
  selectedItem: ComputedRef<Z | undefined>
  selectedValue: ComputedRef<unknown>
}

export interface SingleOptions extends SelectionOptions {}

/**
 * Creates a single selection context for managing collections where only one item can be selected.
 * This function extends the selection functionality with single-selection constraints.
 *
 * @param options Optional configuration for single selection behavior.
 * @template Z The type of items managed by the single selection.
 * @template E The type of the single selection context.
 * @returns The single selection context object.
 */
export function useSingle<
  Z extends SingleTicket = SingleTicket,
  E extends SingleContext<Z> = SingleContext<Z>,
> (options?: SingleOptions): E {
  const registry = useSelection<Z, E>(options)
  const mandatory = options?.mandatory ?? true

  const selectedId = computed(() => registry.selectedIds.values().next().value)
  const selectedItem = computed(() => registry.selectedItems.value.values().next().value)
  const selectedIndex = computed(() => selectedItem.value?.index ?? -1)
  const selectedValue = computed(() => selectedItem.value?.value)

  function select (id: ID) {
    const item = registry.get(id)
    if (!item || item.disabled) return

    registry.selectedIds.clear()
    registry.selectedIds.add(id)
  }

  function unselect (id: ID) {
    if (mandatory && registry.selectedIds.size === 1) return

    registry.selectedIds.delete(id)
  }

  function toggle (id: ID) {
    if (registry.selectedIds.has(id)) unselect(id)
    else select(id)
  }

  return {
    ...registry,
    selectedId,
    selectedItem,
    selectedIndex,
    selectedValue,
    select,
    unselect,
    toggle,
  } as E
}

/**
 * Creates a single selection registry context with full injection/provision control.
 * Returns the complete trinity for advanced usage scenarios.
 *
 * @param namespace The namespace for the single selection registry context
 * @param options Optional configuration for single selection behavior.
 * @template Z The structure of the registry single selection items.
 * @template E The available methods for the single's context.
 * @returns A tuple containing the inject function, provide function, and the single selection context.
 */
export function createSingleContext<
  Z extends SingleTicket = SingleTicket,
  E extends SingleContext<Z> = SingleContext<Z>,
> (
  namespace: string,
  options?: SingleOptions,
): ContextTrinity<E> {
  const [useSingleContext, _provideSingleContext] = createContext<E>(namespace)
  const context = useSingle<Z, E>(options)

  function provideSingleContext (_context: E = context, app?: any): E {
    return _provideSingleContext(_context, app)
  }

  return createTrinity<E>(useSingleContext, provideSingleContext, context)
}
