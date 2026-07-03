import { computed, ref, shallowRef } from 'vue'

export interface CartItem {
  id: string
  name: string
  price: number
  stock: number
  qty: number
}

export interface CartOrder {
  lines: { name: string, qty: number, subtotal: number }[]
  subtotal: number
  tax: number
  total: number
}

const TAX_RATE = 0.0825

export function useCart () {
  const items = ref<CartItem[]>([
    { id: 'tee', name: 'Organic cotton tee', price: 24, stock: 8, qty: 2 },
    { id: 'mug', name: 'Stoneware mug', price: 16.5, stock: 12, qty: 1 },
    { id: 'tote', name: 'Canvas tote bag', price: 12, stock: 4, qty: 3 },
    { id: 'cap', name: 'Embroidered cap', price: 28, stock: 0, qty: 0 },
  ])

  const placed = shallowRef<CartOrder>()

  const subtotal = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * (item.qty ?? 0), 0),
  )

  const tax = computed(() => subtotal.value * TAX_RATE)

  const total = computed(() => subtotal.value + tax.value)

  const count = computed(() =>
    items.value.reduce((sum, item) => sum + (item.qty ?? 0), 0),
  )

  function lineSubtotal (item: CartItem) {
    return item.price * (item.qty ?? 0)
  }

  function checkout (valid: boolean) {
    if (!valid) return

    placed.value = {
      lines: items.value
        .filter(item => (item.qty ?? 0) > 0)
        .map(item => ({
          name: item.name,
          qty: item.qty,
          subtotal: lineSubtotal(item),
        })),
      subtotal: subtotal.value,
      tax: tax.value,
      total: total.value,
    }
  }

  function reset () {
    items.value = items.value.map(item => ({ ...item, qty: item.id === 'cap' ? 0 : 1 }))
    placed.value = undefined
  }

  return { items, placed, subtotal, tax, total, count, lineSubtotal, checkout, reset }
}
