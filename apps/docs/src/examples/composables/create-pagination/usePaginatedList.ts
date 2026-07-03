import { createPagination } from '@vuetify/v0'
import { computed, shallowRef } from 'vue'

export interface Employee {
  id: number
  name: string
  department: string
}

const DEPARTMENTS = ['Design', 'Engineering', 'Marketing', 'Sales']

export const PAGE_SIZES = [6, 12, 24]

export function usePaginatedList () {
  const items: Employee[] = Array.from({ length: 47 }, (_, index) => ({
    id: index + 1,
    name: `Employee ${index + 1}`,
    department: DEPARTMENTS[index % 4]!,
  }))

  const perPage = shallowRef(PAGE_SIZES[0]!)

  const pagination = createPagination({
    size: items.length,
    itemsPerPage: perPage,
    visible: 7,
  })

  const visible = computed(() =>
    items.slice(pagination.pageStart.value, pagination.pageStop.value),
  )

  function resize (value: number) {
    perPage.value = value
    pagination.first()
  }

  return { items, perPage, pagination, visible, resize }
}
