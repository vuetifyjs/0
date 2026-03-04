/**
 * @module SliderTrack
 *
 * @remarks
 * Track element for sliders. Handles click-to-position interaction:
 * on pointerdown, calculates value from pointer position, snaps nearest
 * thumb to that value, and initiates drag.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'
  import { useSliderRoot } from './SliderRoot.vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface SliderTrackProps extends AtomProps {
    /** Namespace for connecting to parent Slider.Root */
    namespace?: string
  }

  export interface SliderTrackSlotProps {
    /** Pre-computed attributes */
    attrs: {
      'data-disabled': true | undefined
      'data-orientation': 'horizontal' | 'vertical'
    }
  }
</script>

<script setup lang="ts">
  import { IN_BROWSER } from '#v0/constants/globals'

  // Utilities
  import { toRef, toValue, useTemplateRef } from 'vue'

  defineOptions({ name: 'SliderTrack', inheritAttrs: false })

  defineSlots<{
    default: (props: SliderTrackSlotProps) => any
  }>()

  const {
    as = 'div',
    renderless,
    namespace = 'v0:slider:root',
  } = defineProps<SliderTrackProps>()

  const root = useSliderRoot(namespace)
  const trackRef = useTemplateRef<HTMLElement>('track')

  function getPercent (e: PointerEvent): number {
    const el = trackRef.value
    if (!el) return 0
    const rect = el.getBoundingClientRect()
    const isVertical = toValue(root.orientation) === 'vertical'

    if (isVertical) {
      // Bottom = 0%, Top = 100%
      return ((rect.bottom - e.clientY) / rect.height) * 100
    }
    return ((e.clientX - rect.left) / rect.width) * 100
  }

  function nearest (value: number): number {
    let closest = 0
    let distance = Infinity
    for (let index = 0; index < root.values.value.length; index++) {
      const d = Math.abs(root.values.value[index]! - value)
      if (d < distance) {
        distance = d
        closest = index
      }
    }
    return closest
  }

  function onPointerDown (e: PointerEvent) {
    if (toValue(root.disabled)) return
    if (e.button !== 0) return
    e.preventDefault()

    const percent = getPercent(e)
    const value = root.fromPercent(percent)
    const index = nearest(value)

    root.setValue(index, value)
    root.dragging.value = index

    if (IN_BROWSER) {
      function onPointerMove (e: PointerEvent) {
        const percent = getPercent(e)
        root.setValue(root.dragging.value!, root.fromPercent(percent))
      }

      function onPointerUp () {
        root.dragging.value = null
        document.removeEventListener('pointermove', onPointerMove)
        document.removeEventListener('pointerup', onPointerUp)
      }

      document.addEventListener('pointermove', onPointerMove)
      document.addEventListener('pointerup', onPointerUp)
    }
  }

  const slotProps = toRef((): SliderTrackSlotProps => ({
    attrs: {
      'data-disabled': toValue(root.disabled) ? true : undefined,
      'data-orientation': toValue(root.orientation),
    },
  }))
</script>

<template>
  <Atom
    ref="track"
    v-bind="slotProps.attrs"
    :as
    :renderless
    @pointerdown="onPointerDown"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
