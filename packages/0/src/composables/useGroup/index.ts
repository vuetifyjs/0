/**
 * @module useGroup
 *
 * @remarks
 * Multi-selection composable that extends useSelection with batch operation support
 * and indeterminate state tracking.
 *
 * Key features:
 * - Batch operations (select/unselect/toggle accept ID | ID[])
 * - selectedIndexes computed Set for position-based tracking
 * - Indeterminate state (isNoneSelected, isAllSelected, isIndeterminate)
 * - Bulk operations (selectAll, unselectAll, toggleAll)
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
import { computed, toValue } from 'vue'

// Transformers
import { toArray } from '#v0/composables/toArray'

// Types
import type { App, ComputedRef } from 'vue'
import type { ID } from '#v0/types'
import type { SelectionContext, SelectionContextOptions, SelectionOptions, SelectionTicket } from '#v0/composables/useSelection'
import type { ContextTrinity } from '#v0/composables/createTrinity'

export interface GroupTicket<V = unknown> extends SelectionTicket<V> {}

export interface GroupContext<Z extends GroupTicket> extends SelectionContext<Z> {
  selectedIndexes: ComputedRef<Set<number>>
  /** Whether no items are currently selected */
  isNoneSelected: ComputedRef<boolean>
  /** Whether all selectable (non-disabled) items are selected */
  isAllSelected: ComputedRef<boolean>
  /** Whether some but not all selectable items are selected (indeterminate state) */
  isIndeterminate: ComputedRef<boolean>
  /** Select one or more Tickets by ID */
  select: (ids: ID | ID[]) => void
  /** Unselect one or more Tickets by ID */
  unselect: (ids: ID | ID[]) => void
  /** Toggle one or more Tickets ON and OFF by ID */
  toggle: (ids: ID | ID[]) => void
  /** Select all selectable (non-disabled) items */
  selectAll: () => void
  /** Unselect all items (respects mandatory option) */
  unselectAll: () => void
  /** Toggle between all selected and none selected */
  toggleAll: () => void
}

export interface GroupOptions extends SelectionOptions {}

export interface GroupContextOptions extends SelectionContextOptions {}

/**
 * Creates a new group instance with batch selection operations and indeterminate state.
 *
 * Extends `createSelection` to support selecting, unselecting, and toggling multiple items
 * at once by passing an array of IDs. Adds `selectedIndexes` computed property and
 * indeterminate state tracking for "select all" checkbox patterns.
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
 * - Adds indeterminate state tracking (`isNoneSelected`, `isAllSelected`, `isIndeterminate`)
 * - Adds bulk operations (`selectAll`, `unselectAll`, `toggleAll`)
 * - Perfect for checkboxes, multi-select dropdowns, and bulk operations
 *
 * **Batch Operations:**
 * - Single ID: `group.select('item-1')`
 * - Array of IDs: `group.select(['item-1', 'item-2', 'item-3'])`
 * - Uses `toArray()` utility internally to normalize input
 * - Disabled items are automatically skipped in batch operations
 * - Non-existent IDs are silently ignored
 *
 * **Indeterminate State:**
 * - `isNoneSelected`: true when no items are selected
 * - `isAllSelected`: true when all selectable (non-disabled) items are selected
 * - `isIndeterminate`: true when some but not all items are selected
 * - Only considers non-disabled items for "all selected" calculation
 *
 * **Bulk Operations:**
 * - `selectAll()`: Selects all non-disabled items
 * - `unselectAll()`: Clears selection (respects `mandatory` option)
 * - `toggleAll()`: Toggles between all selected and none selected
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
 * // Check indeterminate state
 * console.log(checkboxes.isIndeterminate.value) // true (some but not all selected)
 * console.log(checkboxes.isAllSelected.value)   // false
 *
 * // Select all items
 * checkboxes.selectAll()
 * console.log(checkboxes.isAllSelected.value)   // true
 * console.log(checkboxes.isIndeterminate.value) // false
 *
 * // Toggle all (will unselect all since currently all selected)
 * checkboxes.toggleAll()
 * console.log(checkboxes.isNoneSelected.value)  // true
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

  /** Computed list of selectable (non-disabled) items */
  const selectableItems = computed(() => {
    return Array.from(registry.values()).filter(item => !toValue(item.disabled))
  })

  /** Whether no items are currently selected */
  const isNoneSelected = computed(() => registry.selectedIds.size === 0)

  /** Whether all selectable (non-disabled) items are selected */
  const isAllSelected = computed(() => {
    const selectable = selectableItems.value
    if (selectable.length === 0) return false
    return selectable.every(item => registry.selectedIds.has(item.id))
  })

  /** Whether some but not all selectable items are selected */
  const isIndeterminate = computed(() => {
    return !isNoneSelected.value && !isAllSelected.value
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

  /** Select all selectable (non-disabled) items */
  function selectAll () {
    for (const item of selectableItems.value) {
      registry.selectedIds.add(item.id)
    }
  }

  /** Unselect all items (respects mandatory option) */
  function unselectAll () {
    if (mandatory && registry.selectedIds.size > 0) {
      // Keep the first selected item to respect mandatory
      const firstSelectedId = Array.from(registry.selectedIds)[0] as ID
      registry.selectedIds.clear()
      registry.selectedIds.add(firstSelectedId)
    } else {
      registry.selectedIds.clear()
    }
  }

  /** Toggle between all selected and none selected */
  function toggleAll () {
    if (isAllSelected.value) {
      unselectAll()
    } else {
      selectAll()
    }
  }

  return {
    ...registry,
    select,
    unselect,
    toggle,
    selectAll,
    unselectAll,
    toggleAll,
    selectedIndexes,
    isNoneSelected,
    isAllSelected,
    isIndeterminate,
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
> (namespace = 'v0:group'): E {
  return useContext<E>(namespace)
}
