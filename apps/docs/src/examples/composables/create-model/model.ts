import { createContext, createModel } from '@vuetify/v0'
import type { ModelContext } from '@vuetify/v0'

export const [
  useColors,
  provideColors,
] = createContext<ModelContext>('demo:colors')

export function createColorModel () {
  const model = createModel()

  model.register({ id: 'red', value: '#ef4444' })
  model.register({ id: 'blue', value: '#3b82f6' })
  model.register({ id: 'green', value: '#22c55e' })
  model.register({ id: 'purple', value: '#a855f7', disabled: true })
  model.register({ id: 'orange', value: '#f97316' })

  // Select initial color
  model.select('red')

  return model
}
