/**
 * @module DataGridRow
 *
 * @see https://0.vuetifyjs.com/components/data/data-grid
 *
 * @remarks
 * Row component for the data grid. Renders as tr by default with
 * role="row" for ARIA grid semantics. Each row can optionally register
 * with the grid context for row ordering and selection.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useDataGridRoot } from './DataGridRoot.vue'

  // Composables
  import { createContext } from '#v0/composables/createContext'

  // Utilities
  import { mergeProps, toRef, useAttrs } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { ID } from '#v0/types'

  export interface DataGridRowContext {
    id: ID | undefined
  }

  export const [useDataGridRow, provideDataGridRow] = createContext<DataGridRowContext | null>({ suffix: 'row' })

  export interface DataGridRowProps extends AtomProps {
    /** Namespace for dependency injection. @default 'v0:data-grid' */
    namespace?: string
    /** Row identifier for selection and ordering */
    id?: ID
  }

  export interface DataGridRowSlotProps {
    id: ID | undefined
    attrs: {
      role: string
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'DataGridRow', inheritAttrs: false })

  defineSlots<{
    default: (props: DataGridRowSlotProps) => unknown
  }>()

  const attrs = useAttrs()

  const {
    as = 'tr',
    renderless,
    namespace = 'v0:data-grid',
    id,
  } = defineProps<DataGridRowProps>()

  // Verify context exists (throws if missing)
  useDataGridRoot(namespace)

  // Always provide row context so cells can access it
  provideDataGridRow(namespace, { id })

  const slotProps = toRef((): DataGridRowSlotProps => ({
    id,
    attrs: {
      role: 'row',
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
