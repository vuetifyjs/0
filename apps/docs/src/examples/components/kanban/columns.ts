export const limit = 2

interface Column {
  id: string
  label: string
  disabled?: boolean
  accept?: () => boolean
}

export function createColumns (count: () => number): Column[] {
  return [
    { id: 'backlog', label: 'Backlog' },
    {
      id: 'doing',
      label: 'Doing',
      accept () {
        return count() < limit
      },
    },
    { id: 'review', label: 'Review' },
    { id: 'shipped', label: 'Shipped', disabled: true },
  ]
}
