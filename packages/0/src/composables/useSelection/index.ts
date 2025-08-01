// Composables
import { useRegistry } from '#v0/composables/useRegistry'

// Utilities
import { shallowReactive, toRef } from 'vue'
import { genId } from '#v0/utilities/helpers'

// Types
import type { Reactive, Ref } from 'vue'
import type { RegistryContext, RegistryOptions, RegistryTicket } from '#v0/composables/useRegistry'
import type { ID } from '#v0/types'

export interface SelectionTicket extends RegistryTicket {
  disabled: boolean
  isActive: Readonly<Ref<boolean, boolean>>
  valueIsIndex: boolean
  /** Toggle self on and off */
  toggle: () => void
}

export interface SelectionContext<Z extends SelectionTicket> extends RegistryContext<Z> {
  selectedIds: Reactive<Set<ID>>
  /** Clear all selected IDs and reindexes */
  reset: () => void
}

export interface SelectionOptions extends RegistryOptions {
  mandatory?: boolean | 'force'
  returnObject?: boolean
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

  function select (id: ID) {
    const item = registry.find(id)

    if (!item || item.disabled) return

    if (selectedIds.has(id)) {
      if (!mandatory || selectedIds.size > 1) {
        selectedIds.delete(id)
      }
    } else {
      selectedIds.clear()
      selectedIds.add(id)
    }
  }

  function register (registrant: Partial<Z> = {}): Reactive<Z> {
    const id = registrant.id ?? genId()
    const item: Partial<Z> = {
      disabled: false,
      valueIsIndex: registrant.value == null,
      ...registrant,
      id,
      isActive: toRef(() => selectedIds.has(id)),
      toggle: () => select(id),
    }

    return registry.register(item) as Reactive<Z>
  }

  function reindex () {
    registry.directory.clear()
    registry.catalog.clear()
    let index = 0

    for (const item of registry.collection.values()) {
      item.index = index
      if (item.valueIsIndex) item.value = index
      registry.directory.set(index, item.id)
      registry.catalog.set(item.value, item.id)
      index++
    }
  }

  function unregister (id: ID) {
    const item = registry.find(id)
    if (!item) return

    selectedIds.delete(id)
    registry.collection.delete(item.id)
    registry.catalog.delete(item.value)
    registry.directory.delete(item.index)
    reindex()
  }

  function reset () {
    selectedIds.clear()
    reindex()
  }

  const context = {
    ...registry,
    selectedIds,
    register,
    unregister,
    reset,
    reindex,
    select,
  } as unknown as E

  return context
}
