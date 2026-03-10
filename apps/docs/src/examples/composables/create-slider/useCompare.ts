import { createSlider, useDocumentEventListener, useToggleScope } from '@vuetify/v0'
import { shallowRef, toRef } from 'vue'

export function useCompare () {
  const slider = createSlider({ min: 0, max: 100, step: 0.5 })
  slider.register({ value: 50 })

  const split = toRef(() => slider.fromValue(slider.values.value[0] ?? 50))
  const dragging = shallowRef(false)
  const track = shallowRef<HTMLElement | null>(null)

  function toPercent (e: PointerEvent): number {
    const el = track.value
    if (!el) return 50
    const rect = el.getBoundingClientRect()
    return ((e.clientX - rect.left) / rect.width) * 100
  }

  useToggleScope(dragging, () => {
    useDocumentEventListener('pointermove', (e: PointerEvent) => {
      slider.set(0, slider.fromPercent(toPercent(e)))
    })

    useDocumentEventListener('pointerup', () => {
      dragging.value = false
    })
  })

  function onPointerdown (e: PointerEvent) {
    if (e.button !== 0) return
    e.preventDefault()

    dragging.value = true
  }

  return { split, dragging, track, onPointerdown }
}
