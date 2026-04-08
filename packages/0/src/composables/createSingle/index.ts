/**
 * @module createSingle
 *
 * @see https://0.vuetifyjs.com/composables/selection/create-single
 *
 * @remarks
 * Single-selection composable that extends createSelection to enforce only one selected item.
 *
 * Key features:
 * - Auto-clears previous selection when selecting new item
 * - Singular computed properties (selectedId, selectedItem, selectedIndex, selectedValue)
 * - Perfect for tabs, radio buttons, theme selectors
 *
 * Inheritance chain: createRegistry → createSelection → createSingle
 */

// Composables
import { useContext } from '#v0/composables/createContext'
import { createSelection } from '#v0/composables/createSelection'
import { createTrinity } from '#v0/composables/createTrinity'

// Utilities
import { toRef } from 'vue'

// Types
import type { SelectionContext, SelectionContextOptions, SelectionOptions, SelectionTicket, SelectionTicketInput } from '#v0/composables/createSelection'
import type { ContextTrinity } from '#v0/composables/createTrinity'
import type { ID } from '#v0/types'
import type { ComputedRef } from 'vue'

/**
 * Input type for single selection tickets.
 * Extend this interface to add custom properties.
 */
export interface SingleTicketInput<V = unknown> extends SelectionTicketInput<V> {}

/**
 * Output type for single selection tickets.
 * Includes all input properties plus selection methods.
 */
export type SingleTicket<Z extends SingleTicketInput = SingleTicketInput> = SelectionTicket<Z>

/**
 * Context returned by createSingle.
 *
 * @template Z The input ticket type.
 * @template E The output ticket type.
 */
export interface SingleContext<
  Z extends SingleTicketInput = SingleTicketInput,
  E extends SingleTicket<Z> = SingleTicket<Z>,
> extends Omit<SelectionContext<Z, E>, 'register' | 'onboard'> {
  selectedId: ComputedRef<ID | undefined>
  selectedIndex: ComputedRef<number>
  selectedItem: ComputedRef<E | undefined>
  selectedValue: ComputedRef<E['value'] | undefined>
  /** Register a new ticket (accepts input type, returns output type) */
  register: (ticket?: Partial<Z>) => E
  /** Onboard multiple tickets at once */
  onboard: (registrations: Partial<Z>[]) => E[]
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
 * @template Z The input ticket type - what users provide to register().
 * @template E The output ticket type - what users receive from get().
 * @template R The context type.
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
 * `createRegistry` → `createSelection` → `createSingle` → `createStep`
 *
 * @see https://0.vuetifyjs.com/composables/selection/create-single
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
 *
 * @example
 * ```ts
 * // With custom ticket type
 * interface TabTicket extends SingleTicketInput {
 *   label: string
 *   icon?: string
 * }
 *
 * const tabs = createSingle<TabTicket>()
 * tabs.register({ label: 'Home', icon: 'mdi-home' })
 * ```
 */
export function createSingle<
  Z extends SingleTicketInput = SingleTicketInput,
  E extends SingleTicket<Z> = SingleTicket<Z>,
  R extends SingleContext<Z, E> = SingleContext<Z, E>,
> (_options: SingleOptions = {}): R {
  const { mandatory = false, multiple = false, ...options } = _options
  const registry = createSelection<Z, E>({ ...options, mandatory, multiple })

  const selectedId = toRef(() => registry.selectedIds.values().next().value)
  const selectedItem = toRef(() => registry.selectedItems.value.values().next().value)
  const selectedIndex = toRef(() => selectedItem.value?.index ?? -1)
  const selectedValue = toRef(() => selectedItem.value?.value)

  return {
    ...registry,
    selectedId,
    selectedItem,
    selectedIndex,
    selectedValue,
    get size () {
      return registry.size
    },
  } as R
}

/**
 * Creates a new single selection context.
 *
 * @param options The options for the single selection context.
 * @template Z The input ticket type.
 * @template E The output ticket type.
 * @template R The context type.
 * @returns A new single selection context.
 *
 * @see https://0.vuetifyjs.com/composables/selection/create-single
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
  Z extends SingleTicketInput = SingleTicketInput,
  E extends SingleTicket<Z> = SingleTicket<Z>,
  R extends SingleContext<Z, E> = SingleContext<Z, E>,
> (_options: SingleContextOptions = {}): ContextTrinity<R> {
  const { namespace = 'v0:single', ...options } = _options
  const context = createSingle<Z, E, R>(options)

  return createTrinity<R>(namespace, context)
}

/**
 * Returns the current single selection instance.
 *
 * @param namespace The namespace for the single selection context. Defaults to `'v0:single'`.
 * @template Z The input ticket type.
 * @template E The output ticket type.
 * @template R The context type.
 * @returns The current single selection instance.
 *
 * @see https://0.vuetifyjs.com/composables/selection/create-single
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
  Z extends SingleTicketInput = SingleTicketInput,
  E extends SingleTicket<Z> = SingleTicket<Z>,
  R extends SingleContext<Z, E> = SingleContext<Z, E>,
> (namespace = 'v0:single'): R {
  return useContext<R>(namespace)
}
