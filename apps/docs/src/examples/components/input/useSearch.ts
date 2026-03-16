import { debounce } from '@vuetify/v0/utilities'
import { ref, shallowRef, watch } from 'vue'
import type { Ref } from 'vue'

const ITEMS = [
  'Apple', 'Apricot', 'Avocado', 'Banana', 'Blackberry', 'Blueberry',
  'Cherry', 'Coconut', 'Cranberry', 'Dragonfruit', 'Elderberry', 'Fig',
  'Grape', 'Guava', 'Kiwi', 'Lemon', 'Lime', 'Lychee', 'Mango',
  'Nectarine', 'Orange', 'Papaya', 'Peach', 'Pear', 'Pineapple',
  'Plum', 'Pomegranate', 'Raspberry', 'Strawberry', 'Watermelon',
]

export function useSearch (query: Ref<string>) {
  const results = ref<string[]>([])
  const loading = shallowRef(false)

  const search = debounce(async (term: string) => {
    loading.value = true

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300))

    results.value = term
      ? ITEMS.filter(item => item.toLowerCase().includes(term.toLowerCase()))
      : []

    loading.value = false
  }, 200)

  watch(query, val => {
    if (val.length < 2) {
      results.value = []
      return
    }
    search(val)
  })

  return { results, loading }
}
