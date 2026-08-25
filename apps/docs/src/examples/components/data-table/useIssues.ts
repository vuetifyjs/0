import { ref, shallowRef } from 'vue'

export interface Issue extends Record<string, unknown> {
  id: string
  title: string
  status: 'open' | 'done'
  assignee: string
}

const seed: Issue[] = [
  { id: 'i1', title: 'Default page size hides rows', status: 'open', assignee: 'Alice' },
  { id: 'i2', title: 'aria-rowcount includes header rows', status: 'open', assignee: 'Bob' },
  { id: 'i3', title: 'Column sort should follow sortedItems', status: 'done', assignee: 'Carol' },
  { id: 'i4', title: 'Search keys come from filterable columns', status: 'open', assignee: 'David' },
  { id: 'i5', title: 'Select-all operates on the current page', status: 'open', assignee: 'Eve' },
  { id: 'i6', title: 'v-if unregisters off-page rows', status: 'done', assignee: 'Frank' },
]

export function useIssues () {
  const issues = ref<Issue[]>([...seed])
  const status = shallowRef('')

  function archive (ids: string[]) {
    if (ids.length === 0) return

    const selected = new Set(ids)
    issues.value = issues.value.filter(issue => !selected.has(issue.id))
    status.value = `Archived ${ids.length} ${ids.length === 1 ? 'issue' : 'issues'}`
  }

  function reset () {
    issues.value = [...seed]
    status.value = ''
  }

  return { issues, status, archive, reset }
}
