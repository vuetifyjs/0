import { shallowRef } from 'vue'

export interface ToolbarAction {
  id: string
  label: string
}

export function useToolbarItems () {
  const actions: ToolbarAction[] = [
    { id: 'new', label: 'New' },
    { id: 'open', label: 'Open' },
    { id: 'save', label: 'Save' },
    { id: 'share', label: 'Share' },
    { id: 'export', label: 'Export' },
    { id: 'print', label: 'Print' },
    { id: 'rename', label: 'Rename' },
    { id: 'duplicate', label: 'Duplicate' },
    { id: 'archive', label: 'Archive' },
    { id: 'delete', label: 'Delete' },
  ]

  const last = shallowRef<ToolbarAction>()

  function run (action: ToolbarAction) {
    last.value = action
  }

  return { actions, last, run }
}
