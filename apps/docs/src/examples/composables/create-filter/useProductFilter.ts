import { createFilter } from '@vuetify/v0'
import { ref, shallowRef, toRef } from 'vue'

export type Product = {
  id: number
  name: string
  description: string
  category: string
  price: number
}

export type MatchMode = 'union' | 'intersection'

const products: Product[] = [
  { id: 1, name: 'Wireless Mouse', description: 'Ergonomic Bluetooth mouse with silent clicks', category: 'Accessories', price: 29 },
  { id: 2, name: 'Mechanical Keyboard', description: 'Hot-swappable switches and RGB backlight', category: 'Accessories', price: 119 },
  { id: 3, name: 'Noise-Cancelling Headphones', description: 'Over-ear wireless headphones with 30h battery', category: 'Audio', price: 249 },
  { id: 4, name: 'Studio Microphone', description: 'USB condenser mic for streaming and podcasts', category: 'Audio', price: 89 },
  { id: 5, name: 'Wireless Earbuds', description: 'Compact earbuds with a pocket charging case', category: 'Audio', price: 149 },
  { id: 6, name: 'Smart Watch', description: 'Fitness tracking, heart rate, and GPS', category: 'Wearables', price: 199 },
  { id: 7, name: 'Fitness Band', description: 'Lightweight activity tracker with sleep insights', category: 'Wearables', price: 59 },
  { id: 8, name: 'Ultrawide Monitor', description: '34-inch curved display for focused work', category: 'Computers', price: 449 },
  { id: 9, name: 'Laptop Stand', description: 'Aluminum riser with adjustable height', category: 'Computers', price: 39 },
  { id: 10, name: 'Wireless Webcam', description: '1080p camera with a built-in microphone', category: 'Computers', price: 69 },
  { id: 11, name: 'Mirrorless Camera', description: '24MP sensor with 4K video recording', category: 'Photography', price: 899 },
  { id: 12, name: 'Camera Tripod', description: 'Carbon-fiber tripod with a quick-release ball head', category: 'Photography', price: 129 },
]

export function useProductFilter () {
  const query = shallowRef('')
  const mode = shallowRef<MatchMode>('union')
  const categories = ref<string[]>([])

  const terms = toRef(() => query.value.split(' ').filter(Boolean))

  const anyTerm = createFilter({ keys: ['name', 'description'], mode: 'union' })
  const allTerms = createFilter({ keys: ['name', 'description'], mode: 'intersection' })

  const anyMatches = anyTerm.apply(terms, products)
  const allMatches = allTerms.apply(terms, products)

  const searched = toRef(() =>
    mode.value === 'intersection' ? allMatches.items.value : anyMatches.items.value,
  )

  const byCategory = createFilter({ keys: ['category'], mode: 'union' })
  const { items: results } = byCategory.apply(categories, searched)

  const total = products.length
  const allCategories = [...new Set(products.map(product => product.category))]

  function clear () {
    query.value = ''
    mode.value = 'union'
    categories.value = []
  }

  return { query, mode, categories, results, total, allCategories, clear }
}
