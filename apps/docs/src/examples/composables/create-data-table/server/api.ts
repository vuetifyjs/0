import type { SortEntry } from '@vuetify/v0'

export interface User {
  id: number
  name: string
  email: string
  department: string
}

const DATABASE: User[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: ['Alice', 'Bob', 'Carol', 'Dan', 'Eve', 'Frank', 'Grace', 'Henry', 'Iris', 'Jack'][i % 10] + ` #${i + 1}`,
  email: `user${i + 1}@example.com`,
  department: ['Engineering', 'Design', 'Marketing', 'Sales'][i % 4],
}))

export interface FetchResult {
  items: User[]
  total: number
}

/**
 * Simulates a server API call with filtering, sorting, and pagination.
 * Returns only the current page of results after a short delay.
 */
export function fetchUsers (
  query: string,
  sorts: SortEntry[],
  page: number,
  itemsPerPage: number,
): Promise<FetchResult> {
  return new Promise(resolve => {
    setTimeout(() => {
      let result = [...DATABASE]

      // Server-side filtering
      const q = query.toLowerCase()
      if (q) {
        result = result.filter(item =>
          item.name.toLowerCase().includes(q)
          || item.email.toLowerCase().includes(q),
        )
      }

      // Server-side sorting
      if (sorts.length > 0) {
        const { key, direction } = sorts[0]
        result.sort((a, b) => {
          const aVal = String(a[key as keyof User])
          const bVal = String(b[key as keyof User])
          const cmp = aVal.localeCompare(bVal)
          return direction === 'desc' ? -cmp : cmp
        })
      }

      const start = (page - 1) * itemsPerPage
      resolve({
        total: result.length,
        items: result.slice(start, start + itemsPerPage),
      })
    }, 400)
  })
}
