/**
 * @module createDataTable/adapters/v0
 *
 * @remarks
 * Default data table adapter that performs all pipeline operations client-side:
 * filtering via createFilter, sorting via computed comparisons, and pagination
 * via createPagination. Automatically resets to page 1 on filter/sort changes.
 */

// Composables
import { createPagination } from '#v0/composables/createPagination'

// Utilities
import { computed, toRef, watch } from 'vue'

// Types
import type { DataTableAdapterContext, DataTableAdapterResult } from './adapter'

// Base
import { DataTableAdapter } from './adapter'

export class ClientAdapter<T extends Record<string, unknown>> extends DataTableAdapter<T> {
  setup (context: DataTableAdapterContext<T>): DataTableAdapterResult<T> {
    const { search, sortBy, locale, paginationOptions, customSorts } = context

    const { allItems, filteredItems } = this.filter(context)
    const sortedItems = this.sort(filteredItems, sortBy, locale, customSorts)

    const pagination = createPagination({
      ...paginationOptions,
      size: toRef(() => sortedItems.value.length),
    })

    const items = computed(() => {
      return sortedItems.value.slice(pagination.pageStart.value, pagination.pageStop.value)
    })

    watch([search, sortBy], () => {
      pagination.first()
    })

    return {
      allItems,
      filteredItems,
      sortedItems,
      items,
      pagination,
      total: toRef(() => sortedItems.value.length),
    }
  }
}
