/**
 * @module createDataTable/adapters/server
 *
 * @remarks
 * Server-side data table adapter. Assumes all filtering, sorting, and
 * slicing is performed externally (e.g., by an API). The adapter provides
 * pagination controls driven by a server-provided total item count.
 *
 * The consumer is responsible for watching `search`, `sortBy`, and
 * `pagination.page` to trigger API calls and update the `items` ref.
 */

// Composables
import { createPagination } from '#v0/composables/createPagination'

// Utilities
import { computed, toValue, watch } from 'vue'

// Types
import type { DataTableAdapterContext, DataTableAdapterInterface, DataTableAdapterResult } from './adapter'
import type { MaybeRefOrGetter } from 'vue'

// ---- Types ----

export interface ServerAdapterOptions {
  /** Total number of items on the server (for pagination calculation) */
  totalItems: MaybeRefOrGetter<number>
}

// ---- Adapter ----

export class ServerAdapter<T extends Record<string, unknown>> implements DataTableAdapterInterface<T> {
  private options: ServerAdapterOptions

  constructor (options: ServerAdapterOptions) {
    this.options = options
  }

  setup (context: DataTableAdapterContext<T>): DataTableAdapterResult<T> {
    const { items: _items, search, sortBy, paginationOptions } = context

    // Items are provided pre-processed by the server
    const allItems = computed(() => toValue(_items))

    // Pagination driven by server-provided total
    const pagination = createPagination({
      ...paginationOptions,
      size: computed(() => toValue(this.options.totalItems)),
    })

    // Reset to page 1 on filter/sort changes
    watch([search, sortBy], () => {
      pagination.first()
    })

    return {
      allItems,
      filteredItems: allItems,
      sortedItems: allItems,
      items: allItems,
      pagination,
    }
  }
}
