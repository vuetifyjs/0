/**
 * @module DataGridRow
 *
 * @see https://0.vuetifyjs.com/components/data/data-grid
 *
 * @remarks
 * Row component for the data grid. Renders as tr by default with
 * role="row" for ARIA grid semantics. Each row can optionally register
 * with the grid context for row ordering and selection.
 *
 * When the `resizable` prop is true, the row composes `Splitter.Root`
 * to enable column resizing via drag handles. Child `DataGridColumn`
 * components will automatically register as `Splitter.Panel` and
 * `DataGridHandle` can be placed between columns for resize interaction.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'
  import { SplitterRoot } from '#v0/components/Splitter'

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
    resizable: boolean
  }

  export const [useDataGridRow, provideDataGridRow] = createContext<DataGridRowContext | null>({ suffix: 'row' })

  export interface DataGridRowProps extends AtomProps {
    /** Namespace for dependency injection. @default 'v0:data-grid' */
    namespace?: string
    /** Row identifier for selection and ordering */
    id?: ID
    /**
     * Enable column resizing via Splitter composition.
     * When true, the row renders as Splitter.Root and child columns
     * register as Splitter.Panel. Place DataGrid.Handle between columns.
     */
    resizable?: boolean
  }

  export interface DataGridRowSlotProps {
    id: ID | undefined
    /** Whether this row has resizable columns */
    isResizable: boolean
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
    resizable = false,
  } = defineProps<DataGridRowProps>()

  const context = useDataGridRoot(namespace)

  // Always provide row context so cells can access it
  provideDataGridRow(namespace, { id, resizable })

  function onSplitterLayout (sizes: number[]) {
    context.layout.distribute(sizes)
  }

  const slotProps = toRef((): DataGridRowSlotProps => ({
    id,
    isResizable: resizable,
    attrs: {
      role: 'row',
    },
  }))
</script>

<template>
  <component
    :is="resizable ? SplitterRoot : Atom"
    v-bind="resizable
      ? mergeProps(attrs, slotProps.attrs, { orientation: 'horizontal', as: as === 'tr' ? 'div' : as, renderless, onLayout: onSplitterLayout })
      : mergeProps(attrs, slotProps.attrs, { as, renderless })"
  >
    <slot v-bind="slotProps" />
  </component>
</template>
