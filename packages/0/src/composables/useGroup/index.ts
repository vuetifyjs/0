// Composables
import { useSelection } from '#v0/composables/useSelection'

// Utilities
import { computed } from 'vue'
import { genId } from '#v0/utilities/helpers'

// Transformers
import { toArray } from '#v0/transformers'

// Types
import type { ComputedRef, Reactive } from 'vue'
import type { ID } from '#v0/types'
import type { SelectionContext, SelectionOptions, SelectionTicket } from '#v0/composables/useSelection'

export interface GroupTicket extends SelectionTicket {}

export interface GroupContext<Z extends GroupTicket> extends SelectionContext<Z> {
  selectedItems: ComputedRef<Set<Z | undefined>>
  selectedIndexes: ComputedRef<Set<number>>
  selectedValues: ComputedRef<Set<unknown>>
  select: (ids: ID | ID[]) => void
  mandate: () => void
}

export interface GroupOptions extends SelectionOptions {}

export function useGroup<
  Z extends GroupTicket = GroupTicket,
  E extends GroupContext<Z> = GroupContext<Z>,
> (options?: GroupOptions): E {
  const registry = useSelection<Z, E>(options)
  const mandatory = options?.mandatory ?? false

  const selectedIndexes = computed(() => {
    return new Set(
      Array.from(registry.selectedIds).map(id => registry.find(id)?.index),
    )
  })

  const selectedItems = computed(() => {
    return new Set(
      Array.from(registry.selectedIds).map(id => registry.find(id)),
    )
  })

  const selectedValues = computed(() => {
    return new Set(
      Array.from(selectedItems.value).map(item => item?.value),
    )
  })

  function mandate () {
    if (!mandatory || registry.selectedIds.size > 0 || registry.collection.size === 0) return
    for (const item of registry.collection.values()) {
      if (item.disabled) continue
      select(item.id)
      break
    }
  }

  function reset () {
    registry.reset()
    mandate()
  }

  function select (ids: ID | ID[]) {
    for (const id of toArray(ids)) {
      const item = registry.find(id)
      if (!item || item.disabled) continue

      const hasId = registry.selectedIds.has(id)

      if (hasId) {
        if (mandatory && registry.selectedIds.size === 1) {
          continue
        }

        registry.selectedIds.delete(id)
      } else {
        registry.selectedIds.clear()
        registry.selectedIds.add(id)
      }
    }
  }

  function register (registrant: Partial<Z> = {}): Reactive<Z> {
    const id = registrant.id ?? genId()
    const item: Partial<Z> = {
      ...registrant,
      id,
      toggle: () => select(id),
    }

    const ticket = registry.register(item) as Reactive<Z>

    if (mandatory === 'force') mandate()

    return ticket
  }

  const context: E = {
    ...registry,
    selectedItems,
    selectedIndexes,
    selectedValues,
    register,
    mandate,
    select,
    reset,
  }

  return context
}
