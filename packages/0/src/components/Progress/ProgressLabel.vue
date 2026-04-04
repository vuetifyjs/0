/**
 * @module ProgressLabel
 *
 * @remarks
 * Descriptive label for a progress bar. Generates an SSR-safe ID
 * and wires it to the root context so that ProgressRoot can emit
 * a matching `aria-labelledby` attribute on the progressbar element.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'
  import { useProgressRoot } from './ProgressRoot.vue'

  // Utilities
  import { useId } from '#v0/utilities'
  import { onBeforeUnmount, toRef, useAttrs } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface ProgressLabelProps extends AtomProps {
    /** Namespace for context injection from parent Progress.Root */
    namespace?: string
  }

  export interface ProgressLabelSlotProps {
    /** Sum of all segment values */
    total: number
    /** Overall progress as a percentage */
    percent: number
    /** Whether the progress state is indeterminate */
    isIndeterminate: boolean
    /** Pre-computed attributes for binding */
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

  const id = useId()

  root.labelId.value = id

  onBeforeUnmount(() => {
    if (root.labelId.value === id) {
      root.labelId.value = undefined
    }
  })

  const slotProps = toRef((): ProgressLabelSlotProps => ({
    total: root.total.value,
    percent: root.percent.value,
    isIndeterminate: root.isIndeterminate.value,
    attrs: {
      id,
    },
  }))
</script>

<template>
  <Atom
    v-bind="{ ...attrs, ...slotProps.attrs }"
    :as
    :renderless
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
