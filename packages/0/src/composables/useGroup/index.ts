/**
 * @module useGroup
 *
 * @remarks
 * Multi-selection composable that extends useSelection with batch operation support.
 *
 * Key features:
 * - Batch operations (select/unselect/toggle accept ID | ID[])
 * - selectedIndexes computed Set for position-based tracking
 * - Perfect for checkboxes, multi-select dropdowns, filter panels
 *
 * Inheritance chain: useRegistry → useSelection → useGroup
 * Extended by: useFeatures
 */

// Factories
import { createContext, useContext } from '#v0/composables/createContext'
import { createTrinity } from '#v0/composables/createTrinity'

// Composables
import { createSelection } from '#v0/composables/useSelection'

// Utilities
import { computed } from 'vue'

// Transformers
import { toArray } from '#v0/composables/toArray'

// Types
import type { App, ComputedRef } from 'vue'
import type { ID } from '#v0/types'
import type { SelectionContext, SelectionContextOptions, SelectionOptions, SelectionTicket } from '#v0/composables/useSelection'
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

export interface GroupContextOptions extends SelectionContextOptions {}

/**
 * Creates a new group instance with batch selection operations.
 *
 * Extends `createSelection` to support selecting, unselecting, and toggling multiple items
 * at once by passing an array of IDs. Adds `selectedIndexes` computed property.
 *
 * @param options The options for the group instance.
 * @template Z The type of the group ticket.
 * @template E The type of the group context.
 * @returns A new group instance with batch selection support.
 *
 * @remarks
 * **Key Differences from `createSelection`:**
 * - `select()` accepts `ID | ID[]` for batch operations
 * - `unselect()` accepts `ID | ID[]` for batch operations
 * - `toggle()` accepts `ID | ID[]` for batch operations
 * - Adds `selectedIndexes` computed Set for getting selected item indexes
 * - Perfect for checkboxes, multi-select dropdowns, and bulk operations
 *
 * **Batch Operations:**
 * - Single ID: `group.select('item-1')`
 * - Array of IDs: `group.select(['item-1', 'item-2', 'item-3'])`
 * - Uses `toArray()` utility internally to normalize input
 * - Disabled items are automatically skipped in batch operations
 * - Non-existent IDs are silently ignored
 *
 * **Inheritance Chain:**
 * `useRegistry` → `createSelection` → `createGroup`
 *
 * **Used By:**
 * - `createFeatures` for feature flag management with multiple selections
 *
 * @see https://0.vuetifyjs.com/composables/selection/use-group
 *
 * @example
 * ```ts
 * import { createGroup } from '@vuetify/v0'
 *
 * const checkboxes = createGroup()
 *
 * checkboxes.onboard([
 *   { id: 'option-a', value: 'Option A' },
 *   { id: 'option-b', value: 'Option B' },
 *   { id: 'option-c', value: 'Option C' },
 * ])
 *
 * // Select multiple items at once
 * checkboxes.select(['option-a', 'option-c'])
 *
 * console.log(checkboxes.selectedIds) // Set { 'option-a', 'option-c' }
 * console.log(Array.from(checkboxes.selectedIndexes.value)) // [0, 2]
 *
 * // Toggle operations
 * checkboxes.toggle(['option-a', 'option-b'])
 * console.log(checkboxes.selectedIds) // Set { 'option-b', 'option-c' }
 * ```
 */
export function createGroup<
  Z extends GroupTicket = GroupTicket,
  E extends GroupContext<Z> = GroupContext<Z>,
> (_options: GroupOptions = {}): E {
  const { mandatory = false, multiple = true, ...options } = _options
  const registry = createSelection<Z, E>({ ...options, mandatory, multiple })

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
    get size () {
      return registry.size
    },
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
> (_options: GroupContextOptions): ContextTrinity<E> {
  const { namespace, ...options } = _options
  const [useGroupContext, _provideGroupContext] = createContext<E>(namespace)
  const context = createGroup<Z, E>(options)

  function provideGroupContext (_context: E = context, app?: App): E {
    return _provideGroupContext(_context, app)
  }

  return createTrinity<E>(useGroupContext, provideGroupContext, context)
}

/**
 * Returns the current group instance.
 *
 * @param namespace The namespace for the group context. Defaults to `'v0:group'`.
 * @returns The current group instance.
 *
 * @see https://0.vuetifyjs.com/composables/selection/use-group
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { useGroup } from '@vuetify/v0'
 *
 *   const group = useGroup()
 * </script>
 *
 * <template>
 *   <div>
 *     <p>Selected: {{ group.selectedIds.size }}</p>
 *   </div>
 * </template>
 * ```
 */
export function useGroup<
  Z extends GroupTicket = GroupTicket,
  E extends GroupContext<Z> = GroupContext<Z>,
> (namespace: string): E {
  return useContext<E>(namespace)
}
