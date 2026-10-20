export interface BarMenu {
  id: string
  label: string
  items: string[]
}

export const menus: BarMenu[] = [
  { id: 'file', label: 'File', items: ['New file', 'Open'] },
  { id: 'edit', label: 'Edit', items: ['Undo', 'Redo'] },
]
