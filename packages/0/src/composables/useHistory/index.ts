import { ref, computed } from 'vue'
import type { ComputedRef } from 'vue'

export interface HistoryOptions {
  size?: number
  deep?: boolean
}

export interface HistoryContext {
  buffer: ComputedRef<unknown[]>
  size: number
  deep: boolean
  push: (...items: unknown[]) => void
  undo: () => void
  redo: () => void
}

export function useHistory (_options: HistoryOptions = {}): HistoryContext {
  const {
    size = 10,
    deep = true,
  } = _options

  let pointer = 0
  const ring = ref<unknown[]>([])
  let lastValue: unknown
  const buffer = computed(() => ring.value.slice(pointer).concat(ring.value.slice(0, pointer)))
  const isFull = computed(() => buffer.value.length === size)

  function push (...items: unknown[]) {
    for (const item of items) {
      lastValue = item
      if (!isFull.value) {
        ring.value.push(item)
      }
      ring.value[pointer] = item
      pointer = (pointer + 1) % size
    }
  }

  function redo () {
    push(lastValue)
  }

  function undo () {
    pointer = (pointer - 1 + size) % size
    lastValue = ring.value[pointer]
    if (isFull.value) {
      ring.value.pop()
    }
    ring.value.splice(pointer, 1)
  }

  return {
    buffer,
    size,
    deep,
    push,
    undo,
    redo,
  }
}
