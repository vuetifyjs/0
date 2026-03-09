import { ref } from 'vue'
import { createContext, createSelection } from '@vuetify/v0'
import type { SelectionContext } from '@vuetify/v0'

export const [
  useColors,
  provideColors,
] = createContext<SelectionContext>('demo:colors')

const colors = [
  { id: 'red', hue: 15 },
  { id: 'blue', hue: 245 },
  { id: 'green', hue: 155 },
  { id: 'purple', hue: 290, disabled: true },
  { id: 'orange', hue: 55 },
]

export function oklch (hue: number) {
  return `oklch(0.72 0.16 ${hue})`
}

export function hueGradient () {
  const stops = []
  for (let h = 0; h <= 360; h += 30) {
    stops.push(`oklch(0.72 0.16 ${h})`)
  }
  return `linear-gradient(to right, ${stops.join(', ')})`
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
