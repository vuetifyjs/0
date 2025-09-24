// Factories
import { createContext } from '#v0/composables/createContext'
import { createTrinity } from '#v0/composables/createTrinity'

// Composables
import { useSelection } from '#v0/composables/useSelection'

// Utilities
import { computed } from 'vue'

// Transformers
import { toArray } from '#v0/composables/toArray'

// Types
import type { ComputedRef } from 'vue'
import type { ID } from '#v0/types'
import type { SelectionContext, SelectionOptions, SelectionTicket } from '#v0/composables/useSelection'
import type { ContextTrinity } from '#v0/composables/createTrinity'

export interface GroupTicket extends SelectionTicket {}

export interface GroupContext<Z extends GroupTicket> extends SelectionContext<Z> {
  selectedIndexes: ComputedRef<Set<number>>
  /** Select one or more Tickets by ID */
  select: (ids: ID | ID[]) => void
  /** Unselect one or more Tickets by ID */
  unselect: (ids: ID | ID[]) => void
  /** Toggle one or more Tickets ON and OFF by ID */
  toggle: (ids: ID | ID[]) => void
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

/**
 * Creates a group selection registry context with full injection/provision control.
 * Returns the complete trinity for advanced usage scenarios.
 *
 * @param namespace The namespace for the group selection registry context
 * @param options Optional configuration for group selection behavior.
 * @template Z The structure of the registry group selection items.
 * @template E The available methods for the group's context.
 * @returns A tuple containing the inject function, provide function, and the group selection context.
 */
export function createGroupContext<
  Z extends GroupTicket = GroupTicket,
  E extends GroupContext<Z> = GroupContext<Z>,
> (
  namespace: string,
  options?: GroupOptions,
): ContextTrinity<E> {
  const [useGroupContext, _provideGroupContext] = createContext<E>(namespace)
  const context = useGroup<Z, E>(options)

  function provideGroupContext (_context: E = context, app?: any): E {
    return _provideGroupContext(_context, app)
  }

  return createTrinity<E>(useGroupContext, provideGroupContext, context)
}
