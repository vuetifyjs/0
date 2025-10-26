/**
 * @module useSingle
 *
 * @remarks
 * Single-selection composable that extends useSelection to enforce only one selected item.
 *
 * Key features:
 * - Auto-clears previous selection when selecting new item
 * - Singular computed properties (selectedId, selectedItem, selectedIndex, selectedValue)
 * - Perfect for tabs, radio buttons, theme selectors
 *
 * Inheritance chain: useRegistry → useSelection → useSingle
 */

// Factories
import { createContext } from '#v0/composables/createContext'
import { createTrinity } from '#v0/composables/createTrinity'

// Composables
import { useSelection } from '#v0/composables/useSelection'

// Utilities
import { computed } from 'vue'

// Types
import type { ContextTrinity } from '#v0/composables/createTrinity'
import type { ID } from '#v0/types'
import type { App, ComputedRef } from 'vue'
import type { SelectionContext, SelectionOptions, SelectionTicket } from '#v0/composables/useSelection'

export interface SingleTicket extends SelectionTicket {}

export interface SingleContext<Z extends SingleTicket> extends SelectionContext<Z> {
  selectedId: ComputedRef<ID | undefined>
  selectedIndex: ComputedRef<number>
  selectedItem: ComputedRef<Z | undefined>
  selectedValue: ComputedRef<unknown>
}

export interface SingleOptions extends SelectionOptions {}

/**
 * Creates a new single selection instance that enforces only one selected item at a time.
 *
 * Extends `useSelection` by automatically clearing previous selections when a new item is selected.
 * Adds computed singular properties: `selectedId`, `selectedItem`, `selectedIndex`, `selectedValue`.
 *
 * @param options The options for the single selection instance.
 * @template Z The type of the single selection ticket.
 * @template E The type of the single selection context.
 * @returns A new single selection instance with single-selection enforcement.
 *
 * @remarks
 * **Key Differences from `useSelection`:**
 * - Automatically clears `selectedIds` before selecting a new item (enforces single selection)
 * - Provides singular computed properties instead of plural sets
 * - Perfect for tabs, radio buttons, theme selectors, and other single-choice UI components
 *
 * **Computed Properties:**
 * - `selectedId`: The ID of the selected item (undefined if none selected)
 * - `selectedItem`: The selected ticket object (undefined if none selected)
 * - `selectedIndex`: The index of the selected item (-1 if none selected)
 * - `selectedValue`: The value of the selected item (undefined if none selected)
 *
 * **Inheritance Chain:**
 * `useRegistry` → `useSelection` → `useSingle` → `useStep`
 *
 * @see https://0.vuetifyjs.com/composables/selection/use-single
 *
 * @example
 * ```ts
 * import { useSingle } from '@vuetify/v0'
 *
 * const tabs = useSingle({ mandatory: true })
 *
 * tabs.onboard([
 *   { id: 'home', value: 'Home' },
 *   { id: 'about', value: 'About' },
 *   { id: 'contact', value: 'Contact' },
 * ])
 *
 * tabs.first() // Select first tab
 *
 * console.log(tabs.selectedId.value) // 'home'
 * console.log(tabs.selectedIndex.value) // 0
 *
 * tabs.select('about') // Switch to about tab
 * console.log(tabs.selectedId.value) // 'about'
 * console.log(tabs.selectedIds.size) // 1 (always enforces single selection)
 * ```
 */
export function useSingle<
  Z extends SingleTicket = SingleTicket,
  E extends SingleContext<Z> = SingleContext<Z>,
> (options?: SingleOptions): E {
  const registry = useSelection<Z, E>(options)
  const mandatory = options?.mandatory ?? false

  const selectedId = computed(() => registry.selectedIds.values().next().value)
  const selectedItem = computed(() => registry.selectedItems.value.values().next().value)
  const selectedIndex = computed(() => selectedItem.value?.index ?? -1)
  const selectedValue = computed(() => selectedItem.value?.value)

  function select (id: ID) {
    const item = registry.get(id)
    if (!item || item.disabled) return

    registry.selectedIds.clear()
    registry.select(id)
  }

  function unselect (id: ID) {
    if (mandatory && registry.selectedIds.size === 1) return

    registry.selectedIds.delete(id)
  }

  function toggle (id: ID) {
    if (registry.selectedIds.has(id)) unselect(id)
    else select(id)
  }

  return {
    ...registry,
    selectedId,
    selectedItem,
    selectedIndex,
    selectedValue,
    select,
    unselect,
    toggle,
    get size () {
      return registry.size
    },
  } as E
}

/**
 * Creates a new single selection context.
 *
 * @param namespace The namespace for the single selection context.
 * @param options The options for the single selection context.
 * @template Z The type of the single selection ticket.
 * @template E The type of the single selection context.
 * @returns A new single selection context.
 *
 * @see https://0.vuetifyjs.com/composables/selection/use-single
 *
 * @example
 * ```ts
 * import { createSingleContext } from '@vuetify/v0'
 *
 * export const [useTabs, provideTabs, tabs] = createSingleContext('tabs', { mandatory: true })
 *
 * // In a parent component:
 * provideTabs()
 *
 * // In a child component:
 * const tabs = useTabs()
 * tabs.select('tab-1')
 * ```
 */
export function createSingleContext<
  Z extends SingleTicket = SingleTicket,
  E extends SingleContext<Z> = SingleContext<Z>,
> (
  namespace: string,
  options?: SingleOptions,
): ContextTrinity<E> {
  const [useSingleContext, _provideSingleContext] = createContext<E>(namespace)
  const context = useSingle<Z, E>(options)

  function provideSingleContext (_context: E = context, app?: App): E {
    return _provideSingleContext(_context, app)
  }

  return createTrinity<E>(useSingleContext, provideSingleContext, context)
}
