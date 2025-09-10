import { ref, computed } from 'vue'

import type { Ref } from 'vue'

export interface HistoryOptions {
  size?: number
  deep?: boolean
}

export interface HistoryContext {
  buffer: Ref<unknown[]>
  size: number
  deep: boolean
  push: (item: unknown) => void
  values: () => unknown[]
}

export function useHistory (_options: HistoryOptions = {}): HistoryContext {
  const {
    size = 10,
    deep = true,
  } = _options

  const buffer = ref<unknown[]>([])
  const isFull = computed(() => buffer.value.length === size)
  let pointer = 0

  function push (item: unknown) {
    if (!isFull) {
      buffer.value.push(item)
    }
    buffer.value[pointer] = item
    pointer = (pointer + 1) % size
  }

  function values () {
    return buffer.value.slice(pointer).concat(buffer.value.slice(0, pointer))
  }

  return {
    buffer,
    size,
    deep,
    push,
    values,
  }
}
