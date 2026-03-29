/**
 * @module createCombobox/adapters/server
 *
 * @remarks
 * Server-side combobox adapter. All filtering is performed externally.
 * The adapter is a pass-through — it shows all registered items and
 * exposes loading state for the consumer to control.
 *
 * The consumer watches `query` via useComboboxContext() or slot props
 * and provides filtered items reactively.
 */

// Utilities
import { computed, shallowRef, toRef } from 'vue'

// Types
import type { ID } from '#v0/types'
import type { ComboboxAdapterContext, ComboboxAdapterInterface, ComboboxAdapterResult } from './adapter'

export interface ServerAdapterOptions {
  /** Debounce delay in ms before query changes propagate. Default: 300 */
  debounce?: number
}

export class ServerAdapter implements ComboboxAdapterInterface {
  constructor (_options: ServerAdapterOptions = {}) {}

  setup (context: ComboboxAdapterContext): ComboboxAdapterResult {
    const isLoading = shallowRef(false)

    // Pass-through: all registered items are visible
    const filtered = computed(() => {
      return new Set<ID>(context.items.value.map(t => t.id))
    })

    const isEmpty = toRef(() => context.items.value.length === 0)

    return {
      filtered,
      isLoading,
      isEmpty,
    }
  }
}
