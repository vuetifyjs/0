/**
 * @module createDataGrid/adapters/virtual
 *
 * @remarks
 * Virtual scrolling grid adapter. Client-side filter/sort with row
 * ordering, feeding all sorted items to createVirtual.
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
      const order = this.rowOrder.value
      if (order.length === 0) return sortedItems.value

      const map = new Map<ID, T>()
      for (const item of sortedItems.value) {
        map.set(item[this.itemKey] as ID, item)
      }

      const result: T[] = []
      for (const id of order) {
        const item = map.get(id)
        if (item) result.push(item)
      }

      for (const item of sortedItems.value) {
        if (!order.includes(item[this.itemKey] as ID)) {
          result.push(item)
        }
      }

      return result
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
