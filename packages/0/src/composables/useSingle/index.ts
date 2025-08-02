// Composables
import { useSelection } from '#v0/composables/useSelection'

// Utilities
import { computed } from 'vue'
import { genId } from '#v0/utilities'

// Types
import type { ID } from '#v0/types'
import type { ComputedRef, Reactive } from 'vue'
import type { SelectionContext, SelectionOptions, SelectionTicket } from '#v0/composables/useSelection'

export interface SingleTicket extends SelectionTicket {}

export interface SingleContext<Z extends SingleTicket> extends SelectionContext<Z> {
  selectedId: ComputedRef<ID | undefined>
  selectedIndex: ComputedRef<number>
  selectedItem: ComputedRef<Z | undefined>
  selectedValue: ComputedRef<unknown>
  select: (id: ID) => void
  mandate: () => void
}

export interface SingleOptions extends SelectionOptions {}

/**
 * Creates a single selection context for managing collections where only one item can be selected.
 * This function extends the selection functionality with single-selection constraints.
 *
 * @param options Optional configuration for single selection behavior.
 * @param namespace Optional namespace for context sharing.
 * @template Z The type of items managed by the single selection.
 * @template E The type of the single selection context.
 * @returns The single selection context object.
 */
export function useSingle<
  Z extends SingleTicket = SingleTicket,
  E extends SingleContext<Z> = SingleContext<Z>,
> (options?: SingleOptions): E {
  const registry = useSelection<Z, E>(options)
  const mandatory = options?.mandatory ?? false

  const selectedId = computed(() => registry.selectedIds.values().next().value)
  const selectedItem = computed(() => selectedId.value ? registry.find(selectedId.value) : undefined)
  const selectedIndex = computed(() => selectedItem.value ? selectedItem.value.index : -1)
  const selectedValue = computed(() => selectedItem.value ? selectedItem.value.value : undefined)

  function mandate () {
    if (!mandatory || registry.selectedIds.size > 0 || registry.collection.size === 0) return

    const firstId = registry.lookup(0)
    if (firstId) registry.select(firstId)
  }

  function register (registrant: Partial<Z> = {}): Reactive<Z> {
    const id = registrant.id ?? genId()
    const item: Partial<Z> = {
      ...registrant,
      id,
      toggle: () => registry.select(id),
    }

    const ticket = registry.register(item) as Reactive<Z>

    if (mandatory === 'force') mandate()

    return ticket
  }

  const context: E = {
    ...registry,
    selectedId,
    selectedItem,
    selectedIndex,
    selectedValue,
    mandate,
    register,
  }

  return context
}
