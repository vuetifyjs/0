// Factories
import { createTrinity } from '#v0/factories/createTrinity'

// Composables
import { useRegistry } from '#v0/composables/useRegistry'

// Utilities
import { reactive, toRef } from 'vue'
import { genId } from '#v0/utilities/helpers'

// Types
import type { ComputedGetter, Reactive } from 'vue'
import type { RegistryContext, RegistryTicket } from '#v0/composables/useRegistry'
import type { ID } from '#v0/types'

export type SelectionTicket = RegistryTicket & {
  disabled: boolean
  isActive: Readonly<ComputedGetter<boolean>>
  valueIsIndex: boolean
  /** Toggle self on and off */
  toggle: () => void
}

export type SelectionContext<Z extends SelectionTicket = SelectionTicket> = RegistryContext<Z> & {
  selectedIds: Reactive<Set<ID>>
  /** Register a new item */
  register: (item?: Partial<Z>, id?: ID) => Reactive<Z>
  /** Select the first available value */
  mandate: () => void
  /** Select item(s) by ID(s) */
  select: (ids: ID | ID[]) => void
  /** Clear all selected IDs, reindex, and mandate a value */
  reset: () => void
}

export type SelectionOptions = {
  mandatory?: boolean | 'force'
  returnObject?: boolean
}

export function useSelection<
  Z extends SelectionTicket = SelectionTicket,
  E extends SelectionContext = SelectionContext,
> (namespace: string) {
  const [useRegistryContext, provideRegistryContext, registry] = useRegistry<Z, E>(namespace)
  const selectedIds = reactive(new Set<ID>())

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

    const ticket = registry.register(item, id)

    return ticket as Reactive<Z>
  }

  function unregister (id: ID) {
    selectedIds.delete(id)
    registry.unregister(id)
  }

  function reset () {
    selectedIds.clear()
    registry.reindex()
  }

  return createTrinity<E>(useRegistryContext, provideRegistryContext, {
    ...registry,
    selectedIds,
    register,
    unregister,
    reset,
  } as unknown as E)
}
