import { ref, shallowRef, toRef } from 'vue'
import { createModel, useProxyRegistry } from '@vuetify/v0'

export const sizes = ['XS', 'S', 'M', 'L', 'XL']
export const allToppings = ['cheese', 'lettuce', 'tomato', 'onion', 'avocado']

export function createCompound () {
  const store = createModel({ events: true, enroll: false })
  const proxy = useProxyRegistry(store)

  const name = shallowRef('John')
  const size = shallowRef('M')
  const toppings = ref(['cheese', 'lettuce'])
  const quantity = shallowRef(2)

  store.register({ id: 'name', value: name, disabled: shallowRef(false) })
  store.register({ id: 'size', value: size, disabled: shallowRef(false) })
  store.register({ id: 'toppings', value: toppings, disabled: shallowRef(false) })
  store.register({ id: 'quantity', value: quantity, disabled: shallowRef(false) })

  const tickets = toRef(() => [...proxy.values])
  const compound = toRef(() => [...store.selectedValues.value])

  return { store, tickets, compound, name, size, toppings, quantity }
}
