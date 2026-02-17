// Utilities
import { ref, computed } from 'vue'

// Types
import type { Ref } from 'vue'

export function useFilter<T extends Record<string, unknown>> (
  items: Ref<T[]>,
  keys: (keyof T)[],
) {
  const query = ref('')

  const filtered = computed(() => {
    const q = query.value.toLowerCase().trim()
    if (!q) return items.value

    return items.value.filter(item =>
      keys.some(key => {
        const val = item[key]
        return typeof val === 'string' && val.toLowerCase().includes(q)
      }),
    )
  })

  return { query, filtered }
}
