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
  import { mergeProps, onUnmounted, toRef, toValue, useAttrs, watch } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  // Types
  import type { ShallowRef } from 'vue'

  export interface ProgressFillProps extends AtomProps {
    value?: number
    namespace?: string
  }

  export interface ProgressFillSlotProps {
    value: number
    percent: number
    index: number
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

  const ticket = root.register(props.value)

  watch(() => props.value, v => {
    (ticket.value as ShallowRef<number>).value = v ?? 0
  })

  onUnmounted(() => {
    ticket.unregister()
  })

  const current = toRef(() => toValue(ticket.value) as number)
  const percent = toRef(() => root.fromValue(current.value))

  const slotProps = toRef((): ProgressFillSlotProps => ({
    value: current.value,
    percent: percent.value,
    index: ticket.index,
    attrs: {
      'data-index': ticket.index,
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
