import { shallowRef, toRef } from 'vue'

export interface ShippingMethod {
  id: string
  label: string
  eta: string
  price: number
}

export interface ShippingOrder {
  method: string
  shipping: number
  total: number
}

export function useShipping () {
  // Fixed cart subtotal the shipping cost is added to
  const subtotal = 64

  const methods: ShippingMethod[] = [
    { id: 'standard', label: 'Standard', eta: '5–7 business days', price: 0 },
    { id: 'express', label: 'Express', eta: '2–3 business days', price: 9 },
    { id: 'overnight', label: 'Overnight', eta: 'Next business day', price: 24 },
  ]

  // Preselect standard so the group always has a value; `mandatory` then
  // prevents the user from clearing it back to none.
  const method = shallowRef('standard')
  const submitted = shallowRef<ShippingOrder>()

  const selected = toRef(() => methods.find(m => m.id === method.value))
  const shipping = toRef(() => selected.value?.price ?? 0)
  const total = toRef(() => subtotal + shipping.value)

  function onSubmit (valid: boolean) {
    if (!valid) return

    submitted.value = {
      method: selected.value?.label ?? '',
      shipping: shipping.value,
      total: total.value,
    }
  }

  function reset () {
    method.value = 'standard'
    submitted.value = undefined
  }

  return { subtotal, methods, method, submitted, selected, shipping, total, onSubmit, reset }
}
