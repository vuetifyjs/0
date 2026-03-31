/**
 * @module createCombobox/adapters
 *
 * @remarks
 * Defines the adapter interface for combobox filtering strategies.
 * Adapters control how items are filtered when the query changes.
 * Client adapters filter locally via createFilter. Server adapters
 * delegate filtering externally and expose query + loading state.
 */

// Types
import type { SelectionTicket } from '#v0/composables/createSelection'
import type { ID } from '#v0/types'
import type { Ref, ShallowRef } from 'vue'

export interface ComboboxAdapterContext {
  /** Current search query */
  query: ShallowRef<string>
  /** Registered selection tickets (the items source of truth) */
  items: Ref<SelectionTicket[]>
}

export interface ComboboxAdapterResult {
  /** Filtered item IDs that should be visible */
  filtered: Ref<Set<ID>>
  /** Whether the adapter is loading (async adapters) */
  isLoading: ShallowRef<boolean>
  /** Whether no items match the current query */
  isEmpty: Ref<boolean>
}

export interface ComboboxAdapterInterface {
  setup: (context: ComboboxAdapterContext) => ComboboxAdapterResult
}
