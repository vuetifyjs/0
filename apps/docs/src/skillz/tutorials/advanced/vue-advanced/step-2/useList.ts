// Utilities
import { shallowRef, triggerRef } from 'vue'

export function useList<T> (initial: T[] = []) {
  const items = shallowRef([...initial])

  function add (item: T) {
    items.value = [...items.value, item]
  }

  function remove (index: number) {
    items.value = items.value.filter((_, i) => i !== index)
  }

  function clear () {
    items.value = []
  }

  return { items, add, remove, clear, triggerRef: () => triggerRef(items) }
}
