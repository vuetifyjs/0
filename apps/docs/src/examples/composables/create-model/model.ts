import { ref } from 'vue'
import { createContext, createSelection } from '@vuetify/v0'
import type { SelectionContext } from '@vuetify/v0'

export const [
  useColors,
  provideColors,
] = createContext<SelectionContext>('demo:colors')

const colors = [
  { id: 'red', hue: 0 },
  { id: 'blue', hue: 217 },
  { id: 'green', hue: 142 },
  { id: 'purple', hue: 271, disabled: true },
  { id: 'orange', hue: 25 },
]

export function oklch (hue: number) {
  return `oklch(0.7 0.15 ${hue})`
}

export function createColorModel () {
  const selection = createSelection({ multiple: true })

  for (const color of colors) {
    selection.register({
      id: color.id,
      value: ref(color.hue),
      disabled: color.disabled,
    })
    if (!color.disabled) selection.select(color.id)
  }

  return selection
}
