<script lang="ts">
  /**
   * @module DataGridTable
   *
   * @see https://0.vuetifyjs.com/components/data/data-grid
   *
   * @remarks
   * The `<table>` element wrapper for the DataGrid compound. Renders a semantic
   * table with proper ARIA attributes. This is not an APG Grid widget.
   */

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
      'role': 'table'
      'aria-rowcount': number | undefined
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'DataGridTable', inheritAttrs: false })

  defineSlots<{
    default: (props: DataGridTableSlotProps) => unknown
  }>()

  const {
    as = 'table',
    namespace = 'v0:data-grid',
    renderless,
  } = defineProps<DataGridTableProps>()

  const attrs = useAttrs()
  const context = useDataGridRoot(namespace)

  const headerRows = toRef(() => context.headers.value.length)
  const truncated = toRef(() => context.items.value.length < context.total.value)

  const slotProps = toRef((): DataGridTableSlotProps => ({
    attrs: {
      'role': 'table',
      'aria-rowcount': truncated.value ? headerRows.value + context.total.value : undefined,
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
