/**
 * @module createDataTable/adapters/virtual
 *
 * @remarks
 * Virtual scrolling data table adapter. Performs client-side filtering
 * and sorting (via DataTableAdapter base) but skips pagination slicing,
 * returning all sorted items for use with createVirtual at the component level.
 *
 * Pagination is created with itemsPerPage matching the total item count,
 * effectively placing all items on a single page. The consumer wraps
 * `table.items` (or `table.sortedItems`) with createVirtual to render
 * only the visible viewport.
 */

// Composables
import { createPagination } from '#v0/composables/createPagination'

// Utilities
import { computed, watch } from 'vue'

// Types
import type { DataTableAdapterContext, DataTableAdapterResult } from './adapter'

// Base
import { DataTableAdapter } from './adapter'

export class VirtualAdapter<T extends Record<string, unknown>> extends DataTableAdapter<T> {
  setup (context: DataTableAdapterContext<T>): DataTableAdapterResult<T> {
    const { search, sortBy, locale, customSorts } = context

    // ---- Filter + Sort ----

    const { allItems, filteredItems } = this.filter(context)
    const sortedItems = this.sort(filteredItems, sortBy, locale, customSorts)

    // ---- Pagination (pass-through, all items on one page) ----

    const size = computed(() => sortedItems.value.length)

    const pagination = createPagination({
      size,
      itemsPerPage: size,
    })

    // Reset on filter/sort (maintains consistent behavior)
    watch([search, sortBy], () => {
      pagination.first()
    })

    return {
      allItems,
      filteredItems,
      sortedItems,
      items: sortedItems,
      pagination,
      total: computed(() => sortedItems.value.length),
    }
  }
}
