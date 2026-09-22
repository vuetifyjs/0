<script lang="ts">
  /**
   * @module DataTableHeader
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

  export interface DataTableHeaderProps extends AtomProps {
    /** Namespace for dependency injection. @default 'v0:data-table' */
    namespace?: string
  }

  export interface DataTableHeaderSlotProps {
    /** 2D header grid for rendering multi-level headers */
    headers: readonly InternalHeader[][]
    attrs: {
      role: 'rowgroup' | undefined
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'DataTableHeader', inheritAttrs: false })

  defineSlots<{
    default: (props: DataTableHeaderSlotProps) => unknown
  }>()

  const {
    as = 'thead',
    namespace = 'v0:data-table',
    renderless,
  } = defineProps<DataTableHeaderProps>()

  const attrs = useAttrs()
  const context = useDataTableRoot(namespace)

  const slotProps = toRef((): DataTableHeaderSlotProps => ({
    headers: context.headers.value,
    attrs: {
      role: as === 'thead' ? undefined : 'rowgroup',
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
