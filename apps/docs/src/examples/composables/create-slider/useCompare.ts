import { createSlider } from '@vuetify/v0'
import { shallowRef, toRef } from 'vue'

export function useCompare () {
  const slider = createSlider({ min: 0, max: 100, step: 0.5 })
  slider.register(50)

  const split = toRef(() => slider.fromValue(slider.values.value[0] ?? 50))
  const dragging = shallowRef(false)
  const track = shallowRef<HTMLElement | null>(null)

  function toPercent (e: PointerEvent): number {
    const el = track.value
    if (!el) return 50
    const rect = el.getBoundingClientRect()
    return ((e.clientX - rect.left) / rect.width) * 100
  }

  function onPointerdown (e: PointerEvent) {
    if (e.button !== 0) return
    e.preventDefault()

    dragging.value = true

    function onPointermove (e: PointerEvent) {
      slider.set(0, slider.fromPercent(toPercent(e)))
    }

    function onPointerup () {
      dragging.value = false
      document.removeEventListener('pointermove', onPointermove)
      document.removeEventListener('pointerup', onPointerup)
    }

    document.addEventListener('pointermove', onPointermove)
    document.addEventListener('pointerup', onPointerup)
  }

  return { split, dragging, track, onPointerdown }
}
