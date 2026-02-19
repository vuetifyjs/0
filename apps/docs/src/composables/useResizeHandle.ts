// Framework
import { clamp, useDocumentEventListener, useStorage, useToggleScope } from '@vuetify/v0'

// Utilities
import { shallowRef } from 'vue'

interface UseResizeHandleOptions {
  storageKey: string
  defaultValue: number
  min: number
  max: number
  direction: 'horizontal' | 'vertical'
}

interface UseResizeHandleReturn {
  size: ReturnType<typeof shallowRef<number>>
  isResizing: ReturnType<typeof shallowRef<boolean>>
  onPointerDown: (e: PointerEvent) => void
  reset: () => void
}

export function useResizeHandle (options: UseResizeHandleOptions): UseResizeHandleReturn {
  const stored = useStorage().get<number>(options.storageKey, options.defaultValue)
  const size = shallowRef(stored.value)
  const isResizing = shallowRef(false)
  const startPos = shallowRef(0)
  const startSize = shallowRef(0)
  const containerSize = shallowRef(0)

  function onPointerDown (e: PointerEvent) {
    e.preventDefault()
    startPos.value = options.direction === 'horizontal' ? e.clientX : e.clientY
    startSize.value = size.value
    if (options.direction === 'vertical') {
      containerSize.value = (e.target as HTMLElement).parentElement?.offsetHeight ?? 1
    }
    isResizing.value = true
  }

  let rafId = 0

  useToggleScope(() => isResizing.value, () => {
    useDocumentEventListener('pointermove', (e: PointerEvent) => {
      if (rafId) return
      rafId = requestAnimationFrame(() => {
        const pos = options.direction === 'horizontal' ? e.clientX : e.clientY
        const delta = pos - startPos.value
        size.value = options.direction === 'vertical'
          ? clamp(startSize.value + (delta / containerSize.value) * 100, options.min, options.max)
          : clamp(startSize.value + delta, options.min, options.max)
        rafId = 0
      })
    })
    useDocumentEventListener('pointerup', () => {
      if (rafId) cancelAnimationFrame(rafId)
      rafId = 0
      stored.value = size.value
      isResizing.value = false
    })
  })

  function reset () {
    size.value = options.defaultValue
    stored.value = options.defaultValue
  }

  return { size, isResizing, onPointerDown, reset }
}
