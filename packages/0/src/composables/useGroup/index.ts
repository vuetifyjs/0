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
 * Creates a new group instance.
 *
 * @param options The options for the group instance.
 * @template Z The type of the group ticket.
 * @template E The type of the group context.
 * @returns A new group instance.
 *
 * @see https://0.vuetifyjs.com/composables/selection/use-group
 *
 * @example
 * ```ts
 * import { useGroup } from '@vuetify/v0'
 *
 * const group = useGroup()
 *
 * group.onboard([
 *   { id: 'item-1', value: 'Item 1' },
 *   { id: 'item-2', value: 'Item 2' },
 *   { id: 'item-3', value: 'Item 3' },
 * ])
 *
 * group.select(['item-1', 'item-2'])
 *
 * console.log(group.selectedIds) // Set { 'item-1', 'item-2' }
 * ```
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
 * Creates a new group context.
 *
 * @param namespace The namespace for the group context.
 * @param options The options for the group context.
 * @template Z The type of the group ticket.
 * @template E The type of the group context.
 * @returns A new group context.
 *
 * @see https://0.vuetifyjs.com/composables/selection/use-group
 *
 * @example
 * ```ts
 * import { createGroupContext } from '@vuetify/v0'
 *
 * export const [useMyGroup, provideMyGroup, myGroup] = createGroupContext('my-group')
 *
 * // In a parent component:
 * provideMyGroup()
 *
 * // In a child component:
 * const group = useMyGroup()
 * ```
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
