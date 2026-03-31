/**
 * @module createCombobox/adapters/client
 *
 * @remarks
 * Default combobox adapter. Filters items client-side using createFilter.
 * Synchronous, zero debounce — items update immediately as the user types.
 */

// Composables
import { createFilter } from '#v0/composables/createFilter'

// Utilities
import { computed, shallowRef, toRef } from 'vue'

// Types
import type { FilterItem, FilterMode } from '#v0/composables/createFilter'
import type { ID } from '#v0/types'
import type { ComboboxAdapterContext, ComboboxAdapterInterface, ComboboxAdapterResult } from './adapter'

export interface ClientAdapterOptions {
  /** Filter matching mode */
  mode?: FilterMode
  /** Object keys to match against (for object values) */
  keys?: string[]
  /** Custom filter function — overrides default matching */
  filter?: (query: string, value: unknown) => boolean
}

export class ClientAdapter implements ComboboxAdapterInterface {
  private options: ClientAdapterOptions

  constructor (options: ClientAdapterOptions = {}) {
    this.options = options
  }

  setup (context: ComboboxAdapterContext): ComboboxAdapterResult {
    const { mode, keys, filter: customFilter } = this.options

    const filter = createFilter({
      mode,
      keys,
      customFilter: customFilter
        ? (query, item) => customFilter(String(query), item)
        : undefined,
    })

    const values = toRef(() => context.items.value.map(t => t.value as FilterItem))
    const { items: filteredValues } = filter.apply(context.query, values)

    const filtered = computed(() => {
      const q = String(context.query.value).trim()
      if (!q) {
        return new Set<ID>(context.items.value.map(t => t.id))
      }
      const matchedValues = new Set(filteredValues.value)
      const ids = new Set<ID>()
      for (const ticket of context.items.value) {
        if (matchedValues.has(ticket.value as FilterItem)) {
          ids.add(ticket.id)
        }
      }
      return ids
    })

    const isEmpty = toRef(() => filtered.value.size === 0)

    return {
      filtered,
      isLoading: shallowRef(false),
      isEmpty,
    }
  }
}
