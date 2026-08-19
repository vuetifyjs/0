<script lang="ts">
  /**
   * @module DataTableTable
   *
   * @see https://0.vuetifyjs.com/components/data/data-table
   *
   * @remarks
   * The `<table>` element wrapper for the DataTable compound. Renders a semantic
   * table with proper ARIA attributes.
   */

  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useDataTableRoot } from './DataTableRoot.vue'

  // Utilities
  import { mergeProps, toRef, useAttrs } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface DataTableTableProps extends AtomProps {
    /** Namespace for dependency injection. @default 'v0:data-table' */
    namespace?: string
  }

  export interface DataTableTableSlotProps {
    attrs: {
      'role': 'table'
      'aria-rowcount': number
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'DataTableTable', inheritAttrs: false })

  defineSlots<{
    default: (props: DataTableTableSlotProps) => unknown
  }>()

  const {
    as = 'table',
    namespace = 'v0:data-table',
    renderless,
  } = defineProps<DataTableTableProps>()

  const attrs = useAttrs()
  const context = useDataTableRoot(namespace)

  const slotProps = toRef((): DataTableTableSlotProps => ({
    attrs: {
      'role': 'table',
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
