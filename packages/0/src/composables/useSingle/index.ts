// Composables
import { useSelection } from '#v0/composables/useSelection'

// Utilities
import { computed } from 'vue'

// Types
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
  const mandatory = options?.mandatory ?? false

  const selectedId = computed(() => registry.selectedIds.values().next().value)
  const selectedItem = computed(() => registry.selectedItems.value.values().next().value)
  const selectedIndex = computed(() => selectedItem.value?.index ?? -1)
  const selectedValue = computed(() => selectedItem.value?.value)

  function select (id: ID) {
    const item = registry.find(id)

    if (!item || item.disabled) return

    if (registry.selectedIds.has(id)) {
      if (!mandatory || registry.selectedIds.size > 1) {
        registry.selectedIds.delete(id)
      }
    } else {
      const first = registry.selectedIds.values().next().value
      if (first) {
        registry.selectedIds.delete(first)
      }
      registry.selectedIds.add(id)
    }
  }

  return {
    ...registry,
    selectedId,
    selectedItem,
    selectedIndex,
    selectedValue,
    select,
  } as E
}
