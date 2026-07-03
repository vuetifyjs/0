import { createNumberField } from '@vuetify/v0'
import { shallowRef, toRef } from 'vue'

export function useOrder () {
  const price = shallowRef<number | null>(19.99)
  const quantity = shallowRef<number | null>(2)

  const priceField = createNumberField({
    value: price,
    min: 0,
    max: 9999,
    step: 0.01,
    format: { style: 'currency', currency: 'USD' },
  })

  const quantityField = createNumberField({
    value: quantity,
    min: 1,
    max: 99,
    step: 1,
  })

  const total = toRef(() => priceField.formatValue((price.value ?? 0) * (quantity.value ?? 0)))

  function reset () {
    price.value = 19.99
    quantity.value = 2
  }

  return { priceField, quantityField, total, reset }
}
