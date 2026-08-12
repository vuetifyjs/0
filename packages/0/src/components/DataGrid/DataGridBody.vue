/**
 * @module DataGridBody
 *
 * @see https://0.vuetifyjs.com/components/data/data-grid
 *
 * @remarks
 * Body section wrapper for the data grid. Renders as tbody by default
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

  export interface DataGridBodyProps extends AtomProps {
    /** Namespace for dependency injection. @default 'v0:data-grid' */
    namespace?: string
  }

  export interface DataGridBodySlotProps {
    attrs: {
      role: string
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'DataGridBody', inheritAttrs: false })

  defineSlots<{
    default: (props: DataGridBodySlotProps) => unknown
  }>()

  const attrs = useAttrs()

  const {
    as = 'tbody',
    renderless,
    namespace = 'v0:data-grid',
  } = defineProps<DataGridBodyProps>()

  // Verify context exists (throws if missing)
  useDataGridRoot(namespace)

  const slotProps = toRef((): DataGridBodySlotProps => ({
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
