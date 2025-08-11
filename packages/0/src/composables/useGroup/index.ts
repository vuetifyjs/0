// Composables
import { useSelection } from '#v0/composables/useSelection'

// Utilities
import { computed } from 'vue'

// Transformers
import { toArray } from '#v0/transformers'

// Types
import type { ComputedRef } from 'vue'
import type { ID } from '#v0/types'
import type { SelectionContext, SelectionOptions, SelectionTicket } from '#v0/composables/useSelection'

export interface GroupTicket extends SelectionTicket {}

export interface GroupContext<Z extends GroupTicket> extends SelectionContext<Z> {
  selectedIndexes: ComputedRef<Set<number>>
  select: (ids: ID | ID[]) => void
}

export interface GroupOptions extends SelectionOptions {}

/**
 * Creates a group selection context for managing collections of items where multiple selections can be made.
 * This function extends the selection functionality with group selection capabilities.
 *
 * @param options Optional configuration for group selection behavior.
 * @template Z The type of items managed by the group selection.
 * @template E The type of the group selection context.
 * @returns The group selection context object.
 */
export function useGroup<
  Z extends GroupTicket = GroupTicket,
  E extends GroupContext<Z> = GroupContext<Z>,
> (options?: GroupOptions): E {
  const registry = useSelection<Z, E>(options)

  const selectedIndexes = computed(() => {
    return new Set(
      Array.from(registry.selectedItems.value).map(item => item?.index),
    )
  })

  function select (ids: ID | ID[]) {
    for (const id of toArray(ids)) {
      registry.select(id)
    }
  }

  function unselect (ids: ID | ID[]) {
    for (const id of toArray(ids)) {
      registry.unselect(id)
    }
  }

  function toggle (ids: ID | ID[]) {
    for (const id of toArray(ids)) {
      registry.toggle(id)
    }
  }

  return {
    ...registry,
    select,
    unselect,
    toggle,
    selectedIndexes,
  } as E
}
