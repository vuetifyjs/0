import { ref, shallowRef, toRef } from 'vue'
import { createModel, useProxyRegistry } from '@vuetify/v0'

export const sizes = ['XS', 'S', 'M', 'L', 'XL']
export const allToppings = ['cheese', 'lettuce', 'tomato', 'onion', 'avocado']

export function createCompound () {
  const model = createModel({ events: true, enroll: false })
  const proxy = useProxyRegistry(model)

  const name = shallowRef('John')
  const size = shallowRef('M')
  const toppings = ref(['cheese', 'lettuce'])
  const quantity = shallowRef(2)

  model.onboard([
    { id: 'name', value: name, disabled: shallowRef(false) },
    { id: 'size', value: size, disabled: shallowRef(false) },
    { id: 'toppings', value: toppings, disabled: shallowRef(false) },
    { id: 'quantity', value: quantity, disabled: shallowRef(false) },
  ])

  const tickets = toRef(() => [...proxy.values])
  const compound = toRef(() => [...model.selectedValues.value])

  return { model, tickets, compound, name, size, toppings, quantity }
}
