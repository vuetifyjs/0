/**
 * @module ProgressValue
 *
 * @remarks
 * Lightweight context reader that renders the overall progress
 * percentage as text. Defaults to `${percent}%` but is fully
 * overridable via scoped slot for custom formatting.
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

  export interface ProgressValueProps extends AtomProps {
    /** Namespace for context injection from parent Progress.Root */
    namespace?: string
  }

  export interface ProgressValueSlotProps {
    /** Sum of all segment values */
    total: number
    /** Overall progress as a percentage */
    percent: number
    /** Whether the progress state is indeterminate */
    isIndeterminate: boolean
    /** Pre-computed attributes for binding */
    attrs: Record<string, never>
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'ProgressValue', inheritAttrs: false })

  const attrs = useAttrs()

  defineSlots<{
    default: (props: ProgressValueSlotProps) => any
  }>()

  const {
    as = 'span',
    renderless,
    namespace = 'v0:progress:root',
  } = defineProps<ProgressValueProps>()

  const root = useProgressRoot(namespace)

  const display = toRef(() => `${Math.round(root.percent.value)}%`)

  const slotProps = toRef((): ProgressValueSlotProps => ({
    total: root.total.value,
    percent: root.percent.value,
    isIndeterminate: root.isIndeterminate.value,
    attrs: {},
  }))
</script>

<template>
  <Atom
    v-bind="mergeProps(attrs, slotProps.attrs)"
    :as
    :renderless
  >
    <slot v-bind="slotProps">{{ display }}</slot>
  </Atom>
</template>
