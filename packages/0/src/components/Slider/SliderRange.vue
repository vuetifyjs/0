/**
 * @module SliderRange
 *
 * @see https://0.vuetifyjs.com/components/forms/slider
 *
 * @remarks
 * Filled region of the slider track. For single thumb, spans from
 * track start to thumb position. For range (two thumbs), spans
 * between the two thumb positions.
 *
 * Exposes `start` and `end` percentages as slot props for positioning.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useSliderRoot } from './SliderRoot.vue'

  // Utilities
  import { mergeProps, toRef, toValue, useAttrs } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface SliderRangeProps extends AtomProps {
    /** Namespace for connecting to parent Slider.Root */
    namespace?: string
  }

  export interface SliderRangeSlotProps {
    /** Start percentage (0-100) */
    start: number
    /** End percentage (0-100) */
    end: number
    /** Pre-computed attributes and style */
    attrs: {
      'data-disabled': true | undefined
      'data-readonly': true | undefined
      'data-orientation': 'horizontal' | 'vertical'
      'style': Record<string, string>
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'SliderRange', inheritAttrs: false })

  const attrs = useAttrs()

  defineSlots<{
    default: (props: SliderRangeSlotProps) => any
  }>()

  const {
    as = 'span',
    renderless,
    namespace = 'v0:slider:root',
  } = defineProps<SliderRangeProps>()

  const root = useSliderRoot(namespace)

  const rawStart = toRef(() => {
    const values = root.values.value
    if (values.length === 0) return 0
    if (values.length === 1) return root.fromValue(root.min)
    return root.fromValue(Math.min(...values))
  })

  const rawEnd = toRef(() => {
    const values = root.values.value
    if (values.length === 0) return 0
    if (values.length === 1) return root.fromValue(values[0]!)
    return root.fromValue(Math.max(...values))
  })

  // Normalize so start <= end (inverted mode flips percent values)
  const start = toRef(() => Math.min(rawStart.value, rawEnd.value))
  const end = toRef(() => Math.max(rawStart.value, rawEnd.value))

  const isVertical = toRef(() => toValue(root.orientation) === 'vertical')

  const slotProps = toRef((): SliderRangeSlotProps => ({
    start: start.value,
    end: end.value,
    attrs: {
      'data-disabled': toValue(root.disabled) ? true : undefined,
      'data-readonly': toValue(root.readonly) ? true : undefined,
      'data-orientation': toValue(root.orientation),
      'style': {
        [isVertical.value ? 'bottom' : 'left']: `${start.value}%`,
        [isVertical.value ? 'height' : 'width']: `${end.value - start.value}%`,
      },
    },
  }))
</script>

<template>
  <Atom
    v-bind="mergeProps(attrs, slotProps.attrs)"
    :as
    :renderless
    :style="[attrs.style, slotProps.attrs.style]"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
