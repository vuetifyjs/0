<script lang="ts">
  /**
   * @module DataTableHead
   *
   * @see https://0.vuetifyjs.com/components/data/data-table
   *
   * @remarks
   * The `<thead>` element wrapper. Exposes the 2D header grid from the context
   * for rendering nested header rows.
   */

  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useDataTableRoot } from './DataTableRoot.vue'

  // Utilities
  import { mergeProps, toRef, useAttrs } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { InternalHeader } from '#v0/composables/createDataTable'

  export interface DataTableHeadProps extends AtomProps {
    /** Namespace for dependency injection. @default 'v0:data-table' */
    namespace?: string
  }

  export interface DataTableHeadSlotProps {
    /** 2D header grid for rendering multi-level headers */
    headers: readonly InternalHeader[][]
    attrs: Record<string, unknown>
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'DataTableHead', inheritAttrs: false })

  defineSlots<{
    default: (props: DataTableHeadSlotProps) => unknown
  }>()

  const {
    as = 'thead',
    namespace = 'v0:data-table',
    renderless,
  } = defineProps<DataTableHeadProps>()

  const attrs = useAttrs()
  const context = useDataTableRoot(namespace)

  const slotProps = toRef((): DataTableHeadSlotProps => ({
    headers: context.headers.value,
    attrs: {},
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
