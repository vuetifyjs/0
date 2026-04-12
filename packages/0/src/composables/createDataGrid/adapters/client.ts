/**
 * @module createDataGrid/adapters/client
 *
 * @remarks
 * Client-side grid adapter. Extends DataTableAdapter with row ordering
 * inserted between sort and pagination stages.
 */

// Composables
import { createPagination } from '#v0/composables/createPagination'

// Adapters
import { DataTableAdapter } from '../../createDataTable/adapters/adapter'

// Utilities
import { computed, toRef, watch } from 'vue'

// Types
import type { ID } from '#v0/types'
import type { DataTableAdapterContext, DataTableAdapterResult } from '../../createDataTable/adapters/adapter'
import type { ShallowRef } from 'vue'

import { applyOrder } from './order'

export class ClientGridAdapter<T extends Record<string, unknown>> extends DataTableAdapter<T> {
  private rowOrder: ShallowRef<ID[]>
  private itemKey: string

  constructor (rowOrder: ShallowRef<ID[]>, itemKey: string) {
    super()
    this.rowOrder = rowOrder
    this.itemKey = itemKey
  }

  setup (context: DataTableAdapterContext<T>): DataTableAdapterResult<T> {
    const { search, sortBy, locale, paginationOptions, customSorts } = context

    const { allItems, filteredItems } = this.filter(context)
    const sortedItems = this.sort(filteredItems, sortBy, locale, customSorts)

    // Row ordering: applied post-sort, pre-pagination
    const orderedItems = computed(() => {
      return applyOrder(sortedItems.value, this.rowOrder.value, this.itemKey)
    })

    const pagination = createPagination({
      ...paginationOptions,
      size: toRef(() => orderedItems.value.length),
    })

    const items = computed(() => {
      return orderedItems.value.slice(pagination.pageStart.value, pagination.pageStop.value)
    })

    watch([search, sortBy], () => {
      pagination.first()
    })

    return {
      allItems,
      filteredItems,
      sortedItems: orderedItems,
      items,
      pagination,
      total: toRef(() => orderedItems.value.length),
    }
  }
}
