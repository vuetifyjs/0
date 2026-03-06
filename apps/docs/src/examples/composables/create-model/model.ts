import { createContext, createSelection } from '@vuetify/v0'
import type { SelectionContext } from '@vuetify/v0'

export const [
  useColors,
  provideColors,
] = createContext<SelectionContext>('demo:colors')

const colors = [
  { id: 'red', value: '#ef4444' },
  { id: 'blue', value: '#3b82f6' },
  { id: 'green', value: '#22c55e' },
  { id: 'purple', value: '#a855f7', disabled: true },
  { id: 'orange', value: '#f97316' },
]

export function createColorModel () {
  const selection = createSelection({ multiple: true })

  for (const color of colors) {
    selection.register(color)
    if (!color.disabled) selection.select(color.id)
  }

  return selection
}
