/**
 * @module createDataGrid/adapters/virtual
 *
 * @remarks
 * Virtual scrolling grid adapter. Client-side filter/sort with row
 * ordering, feeding all sorted items to createVirtual.
 */

// Composables
import { DataTableAdapter } from '#v0/composables/createDataTable'
import { createPagination } from '#v0/composables/createPagination'

// Utilities
import { computed, toRef, watch } from 'vue'

// Types
import type { DataTableAdapterContext, DataTableAdapterResult } from '#v0/composables/createDataTable'
import type { ID } from '#v0/types'
import type { ShallowRef } from 'vue'

import { applyOrder } from './order'

export class VirtualGridAdapter<T extends Record<string, unknown>> extends DataTableAdapter<T> {
  private rowOrder: ShallowRef<ID[]>
  private itemKey: string

  constructor (rowOrder: ShallowRef<ID[]>, itemKey: string) {
    super()
    this.rowOrder = rowOrder
    this.itemKey = itemKey
  }

  setup (context: DataTableAdapterContext<T>): DataTableAdapterResult<T> {
    const { search, sortBy, locale, customSorts } = context

    const { allItems, filteredItems } = this.filter(context)
    const sortedItems = this.sort(filteredItems, sortBy, locale, customSorts)

    const orderedItems = computed(() => {
      return applyOrder(sortedItems.value, this.rowOrder.value, this.itemKey)
    })

    const size = toRef(() => orderedItems.value.length)

    const pagination = createPagination({
      size,
      itemsPerPage: size,
    })

    watch([search, sortBy], () => {
      pagination.first()
    })

    return {
      allItems,
      filteredItems,
      sortedItems: orderedItems,
      items: orderedItems,
      pagination,
      total: toRef(() => orderedItems.value.length),
    }
  }
}
