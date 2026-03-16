<script setup lang="ts">
  import { createSlider, useDocumentEventListener, useToggleScope } from '@vuetify/v0'
  import { shallowRef } from 'vue'
  import { DURATION, provideScrubber } from './context'

  const slider = createSlider({ min: 0, max: DURATION, step: 0.1 })
  slider.register({ value: 0 })

  const scrubbing = shallowRef(false)
  const track = shallowRef<HTMLElement | null>(null)

  function percent (e: PointerEvent): number {
    const el = track.value
    if (!el) return 0
    const rect = el.getBoundingClientRect()
    return ((e.clientX - rect.left) / rect.width) * 100
  }

  useToggleScope(scrubbing, () => {
    useDocumentEventListener('pointermove', (e: PointerEvent) => {
      slider.set(0, slider.fromPercent(percent(e)))
    })

    useDocumentEventListener('pointerup', () => {
      scrubbing.value = false
    })
  })

  function onPointerdown (e: PointerEvent) {
    if (e.button !== 0) return
    e.preventDefault()

    scrubbing.value = true
    slider.set(0, slider.fromPercent(percent(e)))
  }

  provideScrubber({ slider, scrubbing })
</script>

<template>
  <slot :on-pointerdown :track-ref="(el: HTMLElement) => { track = el }" />
</template>
