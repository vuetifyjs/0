<script setup lang="ts">
  import { createSlider } from '@vuetify/v0'
  import { shallowRef } from 'vue'
  import { DURATION, provideScrubber } from './context'

  const slider = createSlider({ min: 0, max: DURATION, step: 0.1 })
  slider.register(0)

  const scrubbing = shallowRef(false)
  const track = shallowRef<HTMLElement | null>(null)

  function percent (e: PointerEvent): number {
    const el = track.value
    if (!el) return 0
    const rect = el.getBoundingClientRect()
    return ((e.clientX - rect.left) / rect.width) * 100
  }

  function onPointerdown (e: PointerEvent) {
    if (e.button !== 0) return
    e.preventDefault()

    scrubbing.value = true
    slider.set(0, slider.fromPercent(percent(e)))

    function onPointermove (e: PointerEvent) {
      slider.set(0, slider.fromPercent(percent(e)))
    }

    function onPointerup () {
      scrubbing.value = false
      document.removeEventListener('pointermove', onPointermove)
      document.removeEventListener('pointerup', onPointerup)
    }

    document.addEventListener('pointermove', onPointermove)
    document.addEventListener('pointerup', onPointerup)
  }

  provideScrubber({ slider, scrubbing })
</script>

<template>
  <slot :on-pointerdown="onPointerdown" :track-ref="(el: HTMLElement) => { track = el }" />
</template>
