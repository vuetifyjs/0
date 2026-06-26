/**
 * @module ProgressTrack
 *
 * @remarks
 * Container element for progress bar fills and buffers.
 * Injects the root progress context and exposes the
 * determinate/indeterminate state via a data attribute.
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

  export interface ProgressTrackProps extends AtomProps {
    /** Namespace for context injection from parent Progress.Root */
    namespace?: string
  }

  export interface ProgressTrackSlotProps {
    /** Pre-computed attributes for binding */
    attrs: {
      'data-state': 'determinate' | 'indeterminate'
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'ProgressTrack', inheritAttrs: false })

  const attrs = useAttrs()

  defineSlots<{
    default: (props: ProgressTrackSlotProps) => any
  }>()

  const {
    as = 'div',
    renderless,
    namespace = 'v0:progress:root',
  } = defineProps<ProgressTrackProps>()

  const root = useProgressRoot(namespace)

  const slotProps = toRef((): ProgressTrackSlotProps => ({
    attrs: {
      'data-state': root.isIndeterminate.value ? 'indeterminate' : 'determinate',
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
