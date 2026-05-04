/**
 * @module ProgressBuffer
 *
 * @remarks
 * Independent buffer indicator for progress bars. Does not register
 * with the segment registry — instead computes its own percentage
 * directly from the root min/max range. Useful for showing buffered
 * or preloaded content alongside the primary progress fill.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useProgressRoot } from './ProgressRoot.vue'

  // Utilities
  import { clamp } from '#v0/utilities'
  import { mergeProps, toRef, useAttrs } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface ProgressBufferProps extends AtomProps {
    /** Buffer value */
    value?: number
    /** Namespace for context injection from parent Progress.Root */
    namespace?: string
  }

  export interface ProgressBufferSlotProps {
    /** Clamped buffer value */
    value: number
    /** Buffer as a percentage of the range */
    percent: number
    /** Pre-computed attributes for binding */
    attrs: {
      'data-buffer': true
      'data-state': 'determinate' | 'indeterminate'
      'style': { width: string }
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'ProgressBuffer', inheritAttrs: false })

  const attrs = useAttrs()

  defineSlots<{
    default: (props: ProgressBufferSlotProps) => any
  }>()

  const {
    as = 'div',
    renderless,
    value = 0,
    namespace = 'v0:progress:root',
  } = defineProps<ProgressBufferProps>()

  const root = useProgressRoot(namespace)

  const extent = toRef(() => root.max - root.min)
  const clamped = toRef(() => clamp(value, root.min, root.max))
  const percent = toRef(() => {
    if (extent.value === 0) return 0
    return ((clamped.value - root.min) / extent.value) * 100
  })

  const slotProps = toRef((): ProgressBufferSlotProps => ({
    value: clamped.value,
    percent: percent.value,
    attrs: {
      'data-buffer': true,
      'data-state': root.isIndeterminate.value ? 'indeterminate' : 'determinate',
      'style': { width: `${percent.value}%` },
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
