<script lang="ts">
  /**
   * @module DataTableEmpty
   *
   * @see https://0.vuetifyjs.com/components/data/data-table
   *
   * @remarks
   * Empty state component that renders when the table has no items.
   * Conditionally renders based on the items count.
   */

  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useDataTableRoot } from './DataTableRoot.vue'

  // Utilities
  import { mergeProps, toRef, useAttrs } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface DataTableEmptyProps extends AtomProps {
    /** Namespace for dependency injection. @default 'v0:data-table' */
    namespace?: string
  }

  export interface DataTableEmptySlotProps {
    /** Whether the table is loading */
    isLoading: boolean
    attrs: Record<string, unknown>
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'DataTableEmpty', inheritAttrs: false })

  defineSlots<{
    default: (props: DataTableEmptySlotProps) => unknown
  }>()

  const {
    as = 'tr',
    namespace = 'v0:data-table',
    renderless,
  } = defineProps<DataTableEmptyProps>()

  const attrs = useAttrs()
  const context = useDataTableRoot(namespace)

  const isEmpty = toRef(() => context.items.value.length === 0)

  const slotProps = toRef((): DataTableEmptySlotProps => ({
    isLoading: context.loading.value,
    attrs: {},
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
