<script lang="ts">
  /**
   * @module DataGridHeader
   *
   * @see https://0.vuetifyjs.com/components/data/data-grid
   *
   * @remarks
   * The `<thead>` element wrapper. Exposes the 2D header grid from the context
   * for rendering nested header rows.
   */

  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useDataGridRoot } from './DataGridRoot.vue'

  // Utilities
  import { mergeProps, toRef, useAttrs } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { InternalHeader } from '#v0/composables/createDataTable'

  export interface DataGridHeaderProps extends AtomProps {
    /** Namespace for dependency injection. @default 'v0:data-grid' */
    namespace?: string
  }

  export interface DataGridHeaderSlotProps {
    /** 2D header grid for rendering multi-level headers */
    headers: readonly InternalHeader[][]
    attrs: {
      role: 'rowgroup' | undefined
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'DataGridHeader', inheritAttrs: false })

  defineSlots<{
    default: (props: DataGridHeaderSlotProps) => unknown
  }>()

  const {
    as = 'thead',
    namespace = 'v0:data-grid',
    renderless,
  } = defineProps<DataGridHeaderProps>()

  const attrs = useAttrs()
  const context = useDataGridRoot(namespace)

  const slotProps = toRef((): DataGridHeaderSlotProps => ({
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
