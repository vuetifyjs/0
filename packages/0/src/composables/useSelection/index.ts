// Composables
import { useRegistry } from '#v0/composables/useRegistry'

// Utilities
import { computed, shallowReactive, toRef } from 'vue'
import { genId } from '#v0/utilities/helpers'

// Types
import type { ComputedRef, Reactive, Ref } from 'vue'
import type { RegistryContext, RegistryOptions, RegistryTicket } from '#v0/composables/useRegistry'
import type { ID } from '#v0/types'

export interface SelectionTicket extends RegistryTicket {
  disabled: boolean
  isActive: Readonly<Ref<boolean, boolean>>
  /** Toggle self on and off */
  toggle: () => void
}

export interface SelectionContext<Z extends SelectionTicket> extends RegistryContext<Z> {
  selectedIndexes: ComputedRef<Set<number>>
  selectedIds: Reactive<Set<ID>>
  selectedItems: ComputedRef<Set<Z>>
  selectedValues: ComputedRef<Set<unknown>>
  /** Clear all selected IDs and reindexes */
  reset: () => void
  mandate: () => void
}

export interface SelectionOptions extends RegistryOptions {
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
 */
export function useSelection<
  Z extends SelectionTicket = SelectionTicket,
  E extends SelectionContext<Z> = SelectionContext<Z>,
> (options?: SelectionOptions): E {
  const registry = useRegistry<Z, E>(options)
  const selectedIds = shallowReactive(new Set<ID>())
  const mandatory = options?.mandatory ?? false

  const selectedIndexes = computed(() => {
    return new Set(
      Array.from(selectedIds).map(id => registry.find(id)?.index),
    )
  })

  const selectedItems = computed(() => {
    return new Set(
      Array.from(selectedIds).map(id => registry.find(id)),
    )
  })

  const selectedValues = computed(() => {
    return new Set(
      Array.from(selectedItems.value).map(item => item?.value),
    )
  })

  function mandate () {
    if (!mandatory || registry.selectedIds.size > 0 || registry.collection.size === 0) return

    const first = registry.lookup(0)
    if (first) select(first)
  }

  function select (id: ID) {
    const item = registry.find(id)

    if (!item || item.disabled) return

    if (selectedIds.has(id)) {
      if (!mandatory || selectedIds.size > 1) {
        selectedIds.delete(id)
      }
    } else {
      selectedIds.add(id)
    }
  }

  function register (registrant: Partial<Z> = {}): Reactive<Z> {
    const id = registrant.id ?? genId()
    const item: Partial<Z> = {
      disabled: false,
      ...registrant,
      id,
      isActive: toRef(() => selectedIds.has(id)),
      toggle: () => select(id),
    }

    const ticket = registry.register(item) as Reactive<Z>

    if (mandatory === 'force') mandate()

    return ticket
  }

  function unregister (id: ID) {
    selectedIds.delete(id)
    registry.unregister(id)
  }

  function reset () {
    registry.collection.clear()
    registry.reindex()
    registry.mandate()
  }

  const context = {
    ...registry,
    selectedIndexes,
    selectedIds,
    selectedItems,
    selectedValues,
    register,
    unregister,
    reset,
    mandate,
    select,
  } as unknown as E

  return context
}
