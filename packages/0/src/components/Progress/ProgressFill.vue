/**
 * @module ProgressFill
 *
 * @remarks
 * Filled region of the progress bar. Auto-registers a segment with
 * the root progress context on mount and unregisters on unmount.
 * Reactively syncs the `value` prop to the segment and exposes
 * percent-based width styling for visual representation.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'
  import { useProgressRoot } from './ProgressRoot.vue'

  // Utilities
  import { mergeProps, onBeforeUnmount, toRef, useAttrs, watch } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface ProgressFillProps extends AtomProps {
    /** Segment value */
    value?: number
    /** Namespace for context injection from parent Progress.Root */
    namespace?: string
  }

  export interface ProgressFillSlotProps {
    /** Current segment value */
    value: number
    /** Segment contribution as a percentage */
    percent: number
    /** Position among registered segments */
    index: number
    /** Pre-computed attributes for binding */
    attrs: {
      'data-index': number
      'data-state': 'determinate' | 'indeterminate'
      'style': { width: string }
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'ProgressFill', inheritAttrs: false })

  const attrs = useAttrs()

  defineSlots<{
    default: (props: ProgressFillSlotProps) => any
  }>()

  const props = defineProps<ProgressFillProps>()

  const {
    as = 'div',
    renderless,
    namespace = 'v0:progress:root',
  } = props

  const root = useProgressRoot(namespace)

  const segment = root.register({ value: props.value ?? 0 })

  watch(() => props.value, v => {
    segment.value.value = v ?? 0
  })

  onBeforeUnmount(() => {
    root.unregister(segment.id)
  })

  const slotProps = toRef((): ProgressFillSlotProps => ({
    value: segment.value.value,
    percent: segment.percent.value,
    index: segment.index,
    attrs: {
      'data-index': segment.index,
      'data-state': root.isIndeterminate.value ? 'indeterminate' : 'determinate',
      'style': { width: `${segment.percent.value}%` },
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
