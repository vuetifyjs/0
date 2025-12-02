/**
 * @module useGroup
 *
 * @remarks
 * Multi-selection composable that extends useSelection with batch operations and tri-state support.
 *
 * Key features:
 * - Batch operations (select/unselect/toggle accept ID | ID[])
 * - Tri-state support via mixed/indeterminate state (mix/unmix)
 * - selectedIndexes computed Set for position-based tracking
 * - Perfect for checkbox trees, multi-select dropdowns, filter panels
 *
 * Tri-state behavior:
 * - Items can be selected, mixed (indeterminate), or unselected
 * - select() clears mixed state, mix() clears selected state (mutually exclusive)
 * - toggle() on a mixed item selects it (resolves positively)
 *
 * Inheritance chain: useRegistry → useSelection → useGroup
 * Extended by: useFeatures
 */

// Factories
import { createContext, useContext } from '#v0/composables/createContext'
import { createTrinity } from '#v0/composables/createTrinity'

// Composables
import { createSelection } from '#v0/composables/useSelection'
import { useProxyRegistry } from '#v0/composables/useProxyRegistry'

// Utilities
import { computed, shallowReactive, toRef, toValue } from 'vue'
import { genId } from '#v0/utilities'

// Transformers
import { toArray } from '#v0/composables/toArray'

// Types
import type { App, ComputedRef, MaybeRef, Reactive, Ref } from 'vue'
import type { ID } from '#v0/types'
import type { SelectionContext, SelectionContextOptions, SelectionOptions, SelectionTicket } from '#v0/composables/useSelection'
import type { ContextTrinity } from '#v0/composables/createTrinity'

export interface GroupTicket<V = unknown> extends SelectionTicket<V> {
  /** Whether the ticket should start in mixed/indeterminate state */
  indeterminate?: MaybeRef<boolean>
  /** Whether the ticket is in a mixed/indeterminate state */
  isMixed: Readonly<Ref<boolean>>
  /** Set self to mixed/indeterminate state */
  mix: () => void
  /** Clear mixed/indeterminate state from self */
  unmix: () => void
}

export interface GroupContext<Z extends GroupTicket> extends SelectionContext<Z> {
  selectedIndexes: ComputedRef<Set<number>>
  /** Select one or more Tickets by ID */
  select: (ids: ID | ID[]) => void
  /** Unselect one or more Tickets by ID */
  unselect: (ids: ID | ID[]) => void
  /** Toggle one or more Tickets ON and OFF by ID */
  toggle: (ids: ID | ID[]) => void
  /** Set of mixed/indeterminate ticket IDs */
  mixedIds: Reactive<Set<ID>>
  /** Set of mixed/indeterminate ticket instances */
  mixedItems: ComputedRef<Set<Z>>
  /** Set one or more Tickets to mixed/indeterminate state by ID */
  mix: (ids: ID | ID[]) => void
  /** Clear mixed/indeterminate state from one or more Tickets by ID */
  unmix: (ids: ID | ID[]) => void
  /** Check if a ticket is in mixed/indeterminate state by ID */
  mixed: (id: ID) => boolean
  /** Whether no items are currently selected */
  isNoneSelected: ComputedRef<boolean>
  /** Whether all selectable (non-disabled) items are selected */
  isAllSelected: ComputedRef<boolean>
  /** Whether some but not all selectable items are selected */
  isMixed: ComputedRef<boolean>
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
 * Creates a new group instance with batch selection and tri-state support.
 *
 * Extends `createSelection` to support selecting, unselecting, and toggling multiple items
 * at once by passing an array of IDs. Adds tri-state (mixed/indeterminate) support for
 * checkbox trees and similar use cases.
 *
 * @param options The options for the group instance.
 * @template Z The type of the group ticket.
 * @template E The type of the group context.
 * @returns A new group instance with batch selection and tri-state support.
 *
 * @remarks
 * **Key Differences from `createSelection`:**
 * - `select()` accepts `ID | ID[]` for batch operations
 * - `unselect()` accepts `ID | ID[]` for batch operations
 * - `toggle()` accepts `ID | ID[]` for batch operations
 * - Adds `selectedIndexes` computed Set for getting selected item indexes
 * - Adds tri-state support via `mix()`, `unmix()`, `mixed()`, `mixedIds`, `mixedItems`
 * - Perfect for checkbox trees, multi-select dropdowns, and bulk operations
 *
 * **Tri-State Support:**
 * - Items can be in one of three states: selected, mixed (indeterminate), or unselected
 * - `mix(id)` sets item to mixed state (clears selected if set)
 * - `unmix(id)` clears mixed state
 * - `select(id)` clears mixed state before selecting
 * - `toggle(id)` on a mixed item selects it (resolves the indeterminate state positively)
 * - Mixed state works on disabled items (it's a computed state, not user action)
 *
 * **Batch Operations:**
 * - Single ID: `group.select('item-1')`
 * - Array of IDs: `group.select(['item-1', 'item-2', 'item-3'])`
 * - Uses `toArray()` utility internally to normalize input
 * - Disabled items are automatically skipped in select operations
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
 * // Set item to mixed/indeterminate state
 * checkboxes.mix('option-a')
 * console.log(checkboxes.mixedIds) // Set { 'option-a' }
 * console.log(checkboxes.selectedIds) // Set { 'option-c' } (option-a removed)
 *
 * // Toggle a mixed item selects it
 * checkboxes.toggle('option-a')
 * console.log(checkboxes.selectedIds) // Set { 'option-a', 'option-c' }
 * console.log(checkboxes.mixedIds) // Set {} (cleared)
 * ```
 */
export function createGroup<
  Z extends GroupTicket = GroupTicket,
  E extends GroupContext<Z> = GroupContext<Z>,
> (_options: GroupOptions = {}): E {
  const { mandatory = false, multiple = true, ...options } = _options
  const selection = createSelection<Z, E>({ ...options, mandatory, multiple, events: true })
  const proxy = useProxyRegistry<Z>(selection)
  const mixedIds = shallowReactive(new Set<ID>())

  const selectedIndexes = computed(() => {
    return new Set(
      Array.from(selection.selectedItems.value).map(item => item?.index),
    )
  })

  const mixedItems = computed(() => {
    return new Set(
      Array.from(mixedIds).map(id => selection.get(id)),
    )
  })

  function mixed (id: ID) {
    return mixedIds.has(id)
  }

  function mix (ids: ID | ID[]) {
    for (const id of toArray(ids)) {
      if (!selection.has(id)) continue
      selection.selectedIds.delete(id)
      mixedIds.add(id)
    }
  }

  function unmix (ids: ID | ID[]) {
    for (const id of toArray(ids)) {
      mixedIds.delete(id)
    }
  }

  function select (ids: ID | ID[]) {
    for (const id of toArray(ids)) {
      mixedIds.delete(id)
      selection.select(id)
    }
  }

  function unselect (ids: ID | ID[]) {
    for (const id of toArray(ids)) {
      selection.unselect(id)
    }
  }

  function toggle (ids: ID | ID[]) {
    for (const id of toArray(ids)) {
      if (mixed(id)) {
        select(id)
      } else {
        selection.toggle(id)
      }
    }
  }

  function register (registration: Partial<Z> = {}): Z {
    const id = registration.id ?? genId()
    const item: Partial<Z> = {
      ...registration,
      id,
      isMixed: toRef(() => mixed(id)),
      select: () => select(id),
      unselect: () => unselect(id),
      toggle: () => toggle(id),
      mix: () => mix(id),
      unmix: () => unmix(id),
    }

    const ticket = selection.register(item) as Z

    if (toValue(registration.indeterminate)) mix(id)

    return ticket
  }

  function unregister (id: ID) {
    mixedIds.delete(id)
    selection.unregister(id)
  }

  function offboard (ids: ID[]) {
    for (const id of ids) {
      mixedIds.delete(id)
    }
    selection.offboard(ids)
  }

  function onboard (registrations: Partial<Z>[]) {
    return registrations.map(registration => register(registration))
  }

  function reset () {
    mixedIds.clear()
    selection.reset()
  }

  const selectableItems = computed(() => {
    return proxy.values.filter(item => !toValue(item.disabled))
  })

  const isAllSelected = computed(() => {
    const items = selectableItems.value
    if (items.length === 0) return false
    return items.every(item => selection.selectedIds.has(item.id))
  })

  const isMixed = toRef(() => {
    return mixedIds.size > 0 || (!isNoneSelected.value && !isAllSelected.value)
  })

  const isNoneSelected = toRef(() => selection.selectedIds.size === 0)

  function selectAll () {
    for (const item of selectableItems.value) {
      mixedIds.delete(item.id)
      selection.select(item.id)
    }
  }

  function unselectAll () {
    const first = selection.selectedIds.values().next().value
    selection.selectedIds.clear()

    if (!mandatory || !first) return

    selection.select(first)
  }

  function toggleAll () {
    if (isAllSelected.value) unselectAll()
    else selectAll()
  }

  return {
    ...selection,
    mixed,
    mix,
    unmix,
    select,
    unselect,
    toggle,
    register,
    unregister,
    offboard,
    onboard,
    reset,
    selectAll,
    unselectAll,
    toggleAll,
    mixedIds,
    mixedItems,
    selectedIndexes,
    isNoneSelected,
    isAllSelected,
    isMixed,
    get size () {
      return selection.size
    },
  } as E
}

/**
 * Creates a new group context.
 *
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
 * // With default namespace 'v0:group'
 * export const [useMyGroup, provideMyGroup, myGroup] = createGroupContext()
 *
 * // Or with custom namespace
 * export const [useMyGroup, provideMyGroup, myGroup] = createGroupContext({ namespace: 'my-group' })
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
> (_options: GroupContextOptions = {}): ContextTrinity<E> {
  const { namespace = 'v0:group', ...options } = _options
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
