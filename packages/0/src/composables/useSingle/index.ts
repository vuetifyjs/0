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

// Composables
import { createContext, useContext } from '#v0/composables/createContext'
import { createTrinity } from '#v0/composables/createTrinity'
import { createSelection } from '#v0/composables/useSelection'

// Utilities
import { computed } from 'vue'

// Types
import type { ContextTrinity } from '#v0/composables/createTrinity'
import type { SelectionContext, SelectionContextOptions, SelectionOptions, SelectionTicket } from '#v0/composables/useSelection'
import type { ID } from '#v0/types'
import type { App, ComputedRef } from 'vue'

export interface SingleTicket<V = unknown> extends SelectionTicket<V> {}

export interface SingleContext<Z extends SingleTicket> extends SelectionContext<Z> {
  selectedId: ComputedRef<ID | undefined>
  selectedIndex: ComputedRef<number>
  selectedItem: ComputedRef<Z | undefined>
  selectedValue: ComputedRef<Z['value'] | undefined>
}

export interface SingleOptions extends SelectionOptions {}

export interface SingleContextOptions extends SelectionContextOptions {}

/**
 * Creates a new single selection instance that enforces only one selected item at a time.
 *
 * Extends `createSelection` by automatically clearing previous selections when a new item is selected.
 * Adds computed singular properties: `selectedId`, `selectedItem`, `selectedIndex`, `selectedValue`.
 *
 * @param options The options for the single selection instance.
 * @template Z The type of the single selection ticket.
 * @template E The type of the single selection context.
 * @returns A new single selection instance with single-selection enforcement.
 *
 * @remarks
 * **Key Differences from `createSelection`:**
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
 * `useRegistry` → `createSelection` → `createSingle` → `createStep`
 *
 * @see https://0.vuetifyjs.com/composables/selection/use-single
 *
 * @example
 * ```ts
 * import { createSingle } from '@vuetify/v0'
 *
 * const tabs = createSingle({ mandatory: true })
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
export function createSingle<
  Z extends SingleTicket = SingleTicket,
  E extends SingleContext<Z> = SingleContext<Z>,
> (_options: SingleOptions = {}): E {
  const { mandatory = false, multiple = false, ...options } = _options
  const registry = createSelection<Z, E>({ ...options, mandatory, multiple })

  const selectedId = computed(() => registry.selectedIds.values().next().value)
  const selectedItem = computed(() => registry.selectedItems.value.values().next().value)
  const selectedIndex = computed(() => selectedItem.value?.index ?? -1)
  const selectedValue = computed(() => selectedItem.value?.value)

  function unselect (id: ID) {
    if (mandatory && registry.selectedIds.size === 1) return

    registry.selectedIds.delete(id)
  }

  function toggle (id: ID) {
    if (registry.selectedIds.has(id)) unselect(id)
    else registry.select(id)
  }

  return {
    ...registry,
    selectedId,
    selectedItem,
    selectedIndex,
    selectedValue,
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
 * // With default namespace 'v0:single'
 * export const [useSingle, provideSingle, context] = createSingleContext()
 *
 * // In a parent component:
 * provideSingle()
 *
 * // In a child component:
 * const single = useSingle()
 * single.select('tab-1')
 * ```
 */
export function createSingleContext<
  Z extends SingleTicket = SingleTicket,
  E extends SingleContext<Z> = SingleContext<Z>,
> (_options: SingleContextOptions = {}): ContextTrinity<E> {
  const { namespace = 'v0:single', ...options } = _options
  const [useSingleContext, _provideSingleContext] = createContext<E>(namespace)
  const context = createSingle<Z, E>(options)

  function provideSingleContext (_context: E = context, app?: App): E {
    return _provideSingleContext(_context, app)
  }

  return createTrinity<E>(useSingleContext, provideSingleContext, context)
}

/**
 * Returns the current single selection instance.
 *
 * @param namespace The namespace for the single selection context. Defaults to `'v0:single'`.
 * @returns The current single selection instance.
 *
 * @see https://0.vuetifyjs.com/composables/selection/use-single
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { useSingle } from '@vuetify/v0'
 *
 *   const tabs = useSingle()
 * </script>
 *
 * <template>
 *   <div>
 *     <p>Selected: {{ tabs.selectedId }}</p>
 *   </div>
 * </template>
 * ```
 */
export function useSingle<
  Z extends SingleTicket = SingleTicket,
  E extends SingleContext<Z> = SingleContext<Z>,
> (namespace = 'v0:single'): E {
  return useContext<E>(namespace)
}
