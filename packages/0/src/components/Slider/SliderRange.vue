/**
 * @module SliderRange
 *
 * @remarks
 * Filled region of the slider track. For single thumb, spans from
 * track start to thumb position. For range (two thumbs), spans
 * between the two thumb positions.
 *
 * Exposes `start` and `end` percentages as slot props and CSS custom
 * properties `--v0-slider-range-start` and `--v0-slider-range-size`
 * for positioning.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'
  import { useSliderRoot } from './SliderRoot.vue'

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
      'data-orientation': 'horizontal' | 'vertical'
      'style': Record<string, string>
    }
  }
</script>

<script setup lang="ts">
  // Utilities
  import { toRef, toValue } from 'vue'

  defineOptions({ name: 'SliderRange', inheritAttrs: false })

  defineSlots<{
    default: (props: SliderRangeSlotProps) => any
  }>()

  const {
    as = 'span',
    renderless,
    namespace = 'v0:slider:root',
  } = defineProps<SliderRangeProps>()

  const root = useSliderRoot(namespace)

  const start = toRef(() => {
    const values = root.values.value
    if (values.length === 0) return 0
    if (values.length === 1) return 0
    return root.percent(Math.min(...values))
  })

  const end = toRef(() => {
    const values = root.values.value
    if (values.length === 0) return 0
    if (values.length === 1) return root.percent(values[0]!)
    return root.percent(Math.max(...values))
  })

  const isVertical = toRef(() => toValue(root.orientation) === 'vertical')

  const slotProps = toRef((): SliderRangeSlotProps => ({
    start: start.value,
    end: end.value,
    attrs: {
      'data-disabled': toValue(root.disabled) ? true : undefined,
      'data-orientation': toValue(root.orientation),
      'style': {
        [isVertical.value ? 'bottom' : 'left']: `${start.value}%`,
        [isVertical.value ? 'height' : 'width']: `${end.value - start.value}%`,
        '--v0-slider-range-start': `${start.value}%`,
        '--v0-slider-range-size': `${end.value - start.value}%`,
      },
    },
  }))
</script>

<template>
  <Atom
    v-bind="slotProps.attrs"
    :as
    :renderless
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
