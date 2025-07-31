// Factories
import { createTrinity } from '#v0/factories/createTrinity'

// Composables
import { useRegistry } from '#v0/composables/useRegistry'

// Utilities
import { shallowReactive, toRef } from 'vue'
import { genId } from '#v0/utilities/helpers'

// Types
import type { Reactive, Ref } from 'vue'
import type { RegistryContext, RegistryOptions, RegistryTicket } from '#v0/composables/useRegistry'
import type { ID } from '#v0/types'
import type { ContextTrinity } from '#v0/factories/createTrinity'

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
 * Creates a selection registry for managing selectable items within a specific namespace.
 * This function provides a base selection system with registration, toggling, and state management
 * for building more complex selection patterns.
 *
 * @param namespace The namespace for the selection context.
 * @template Z The type of the selection items managed by the registry.
 * @template E The type of the selection context.
 * @returns A tuple containing the inject function, provide function, and the selection context.
 */
export function useSelection<
  Z extends SelectionTicket = SelectionTicket,
  E extends SelectionContext<Z> = SelectionContext<Z>,
> (namespace: string): ContextTrinity<E> {
  const [useRegistryContext, provideRegistryContext, registry] = useRegistry<Z, E>(namespace)
  const selectedIds = shallowReactive(new Set<ID>())

  function register (registrant: Partial<Z>, id: ID = genId()): Reactive<Z> {
    const item: Partial<Z> = {
      disabled: false,
      isActive: toRef(() => selectedIds.has(ticket.id)),
      valueIsIndex: registrant?.value == null,
      toggle: () => {
        if (selectedIds.has(ticket.id)) selectedIds.delete(ticket.id)
        else selectedIds.add(ticket.id)
      },
      ...registrant,
    }

    const ticket = registry.register(item, id) as Reactive<Z>

    return ticket
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

  const context: E = {
    ...registry,
    selectedIds,
    register,
    unregister,
    reset,
    reindex,
  }

  return createTrinity<E>(useRegistryContext, provideRegistryContext, context)
}
