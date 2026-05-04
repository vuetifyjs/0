/**
 * @module ProgressLabel
 *
 * @remarks
 * Descriptive label for a progress bar. Reads the label ID from
 * root context (derived from root id) for aria-labelledby wiring.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useProgressRoot } from './ProgressRoot.vue'

  // Utilities
  import { mergeProps, toRef, useAttrs } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface ProgressLabelProps extends AtomProps {
    namespace?: string
  }

  export interface ProgressLabelSlotProps {
    total: number
    percent: number
    isIndeterminate: boolean
    attrs: {
      id: string
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'ProgressLabel', inheritAttrs: false })

  const attrs = useAttrs()

  defineSlots<{
    default: (props: ProgressLabelSlotProps) => any
  }>()

  const {
    as = 'label',
    renderless,
    namespace = 'v0:progress:root',
  } = defineProps<ProgressLabelProps>()

  const root = useProgressRoot(namespace)

  const slotProps = toRef((): ProgressLabelSlotProps => ({
    total: root.total.value,
    percent: root.percent.value,
    isIndeterminate: root.isIndeterminate.value,
    attrs: {
      id: root.labelId,
    },
  }))
</script>

<template>
  <Atom
    v-bind="mergeProps(attrs, slotProps.attrs)"
    :as
    :renderless
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
