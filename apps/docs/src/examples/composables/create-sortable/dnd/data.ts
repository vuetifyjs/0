export interface Item {
  id: string
  label: string
}

export const initialItems: Item[] = [
  { id: 'a', label: 'Cut alpha' },
  { id: 'b', label: 'Ship the docs' },
  { id: 'c', label: 'File the bug' },
  { id: 'd', label: 'Tweet about it' },
  { id: 'e', label: 'Review the PR' },
  { id: 'f', label: 'Update the changelog' },
  { id: 'g', label: 'Notify the Discord' },
  { id: 'h', label: 'Plan the next milestone' },
]
