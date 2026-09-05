<script lang="ts">
  /**
   * @module DataGridEmpty
   *
   * @see https://0.vuetifyjs.com/components/data/data-grid
   *
   * @remarks
   * Empty state component that renders when the grid has no items.
   * Conditionally renders based on the items count.
   */

  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useDataGridRoot } from './DataGridRoot.vue'

  // Utilities
  import { mergeProps, toRef, useAttrs } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface DataGridEmptyProps extends AtomProps {
    /** Namespace for dependency injection. @default 'v0:data-grid' */
    namespace?: string
  }

  export interface DataGridEmptySlotProps {
    /** Whether the table is loading */
    isLoading: boolean
    /** Leaf column count — bind as Cell colspan */
    columnCount: number
    attrs: {
      role: 'row' | undefined
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'DataGridEmpty', inheritAttrs: false })

  defineSlots<{
    default: (props: DataGridEmptySlotProps) => unknown
  }>()

  const {
    as = 'tr',
    namespace = 'v0:data-grid',
    renderless,
  } = defineProps<DataGridEmptyProps>()

  const attrs = useAttrs()
  const context = useDataGridRoot(namespace)

  const isEmpty = toRef(() => context.items.value.length === 0)

  const slotProps = toRef((): DataGridEmptySlotProps => ({
    isLoading: context.loading.value,
    columnCount: context.leaves.value.length,
    attrs: {
      role: as === 'tr' ? undefined : 'row',
    },
  }))
</script>

<template>
  <Atom
    v-if="isEmpty"
    :as
    :renderless
    v-bind="mergeProps(attrs, slotProps.attrs)"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
