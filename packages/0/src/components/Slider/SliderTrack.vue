/**
 * @module SliderTrack
 *
 * @see https://0.vuetifyjs.com/components/forms/slider
 *
 * @remarks
 * Track element for sliders. Handles click-to-position interaction:
 * on pointerdown, calculates value from pointer position, snaps nearest
 * thumb to that value, and initiates drag.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useSliderRoot } from './SliderRoot.vue'

  // Utilities
  import { mergeProps, toRef, toValue, useAttrs, useTemplateRef, watchEffect } from 'vue'

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
      'data-readonly': true | undefined
      'data-orientation': 'horizontal' | 'vertical'
      'style': Record<string, string>
      'onPointerdown': (e: PointerEvent) => void
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'SliderTrack', inheritAttrs: false })

  const attrs = useAttrs()

  defineSlots<{
    default: (props: SliderTrackSlotProps) => any
  }>()

  const {
    as = 'div',
    renderless,
    namespace = 'v0:slider:root',
  } = defineProps<SliderTrackProps>()

  const root = useSliderRoot(namespace)
  const trackRef = useTemplateRef<{ element: HTMLElement | null }>('track')

  // Register track element with root for percent calculation
  // Atom exposes { element } via defineExpose, not the raw HTMLElement
  watchEffect(() => {
    root.track.value = trackRef.value?.element ?? null
  })

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

  function onPointerdown (e: PointerEvent) {
    if (toValue(root.disabled)) return
    if (toValue(root.readonly)) return
    if (e.button !== 0) return

    const el = trackRef.value?.element
    if (!el) return
    const rect = el.getBoundingClientRect()
    const isVertical = toValue(root.orientation) === 'vertical'
    const percent = isVertical
      ? ((rect.bottom - e.clientY) / rect.height) * 100
      : ((e.clientX - rect.left) / rect.width) * 100

    const value = root.fromPercent(percent)
    const index = nearest(value)
    root.set(index, value)
    root.onDrag(index, e)
  }

  const slotProps = toRef((): SliderTrackSlotProps => ({
    attrs: {
      'data-disabled': toValue(root.disabled) ? true : undefined,
      'data-readonly': toValue(root.readonly) ? true : undefined,
      'data-orientation': toValue(root.orientation),
      'style': { 'touch-action': 'none' },
      'onPointerdown': onPointerdown,
    },
  }))
</script>

<template>
  <Atom
    ref="track"
    v-bind="mergeProps(attrs, slotProps.attrs)"
    :as
    :renderless
    :style="[attrs.style, slotProps.attrs.style]"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
