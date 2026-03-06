import { createContext, createModel } from '@vuetify/v0'
import type { ModelContext } from '@vuetify/v0'

export const [
  useColors,
  provideColors,
] = createContext<ModelContext>('demo:colors')

export function createColorModel () {
  const model = createModel({
    multiple: true,
    mandatory: true,
  })

  model.onboard([
    { id: 'red', value: '#ef4444' },
    { id: 'blue', value: '#3b82f6' },
    { id: 'green', value: '#22c55e' },
    { id: 'purple', value: '#a855f7', disabled: true },
    { id: 'orange', value: '#f97316' },
  ])

  // Select initial colors
  model.select('red')
  model.select('blue')

  return model
}
