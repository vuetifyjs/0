/**
 * @module DataGridTable
 *
 * @see https://0.vuetifyjs.com/components/data/data-grid
 *
 * @remarks
 * Semantic table wrapper for the data grid. Renders as table by default
 * with role="grid" for ARIA grid semantics.
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

  export interface DataGridTableProps extends AtomProps {
    /** Namespace for dependency injection. @default 'v0:data-grid' */
    namespace?: string
  }

  export interface DataGridTableSlotProps {
    attrs: {
      'role': string
      'aria-rowcount': number
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'DataGridTable', inheritAttrs: false })

  defineSlots<{
    default: (props: DataGridTableSlotProps) => unknown
  }>()

  const attrs = useAttrs()

  const {
    as = 'table',
    renderless,
    namespace = 'v0:data-grid',
  } = defineProps<DataGridTableProps>()

  const context = useDataGridRoot(namespace)

  const slotProps = toRef((): DataGridTableSlotProps => ({
    attrs: {
      'role': 'grid',
      'aria-rowcount': context.total.value,
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
