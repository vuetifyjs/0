/**
 * @module DataGridHeader
 *
 * @see https://0.vuetifyjs.com/components/data/data-grid
 *
 * @remarks
 * Header section wrapper for the data grid. Renders as thead by default
 * with role="rowgroup" for ARIA grid semantics.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useDataGridRoot } from './DataGridRoot.vue'

  // Utilities
  import { mergeProps, toRef, useAttrs } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface DataGridHeaderProps extends AtomProps {
    /** Namespace for dependency injection. @default 'v0:data-grid' */
    namespace?: string
  }

  export interface DataGridHeaderSlotProps {
    attrs: {
      role: string
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'DataGridHeader', inheritAttrs: false })

  defineSlots<{
    default: (props: DataGridHeaderSlotProps) => unknown
  }>()

  const attrs = useAttrs()

  const {
    as = 'thead',
    renderless,
    namespace = 'v0:data-grid',
  } = defineProps<DataGridHeaderProps>()

  // Verify context exists (throws if missing)
  useDataGridRoot(namespace)

  const slotProps = toRef((): DataGridHeaderSlotProps => ({
    attrs: {
      role: 'rowgroup',
    },
  }))
</script>

<template>
  <Atom
    :as
    :renderless
    v-bind="mergeProps(attrs, slotProps.attrs)"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
