/**
 * @module DataGridCell
 *
 * @see https://0.vuetifyjs.com/components/data/data-grid
 *
 * @remarks
 * Data cell component for the data grid body. Renders as td by default
 * with role="gridcell" for ARIA grid semantics. Exposes editing state
 * and span information from the grid context.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useDataGridRoot } from './DataGridRoot.vue'
  import { useDataGridRow } from './DataGridRow.vue'

  // Utilities
  import { isUndefined } from '#v0/utilities'
  import { mergeProps, toRef, useAttrs } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface DataGridCellProps extends AtomProps {
    /** Namespace for dependency injection. @default 'v0:data-grid' */
    namespace?: string
    /** Column identifier for editing and span lookup */
    column?: string
  }

  export interface DataGridCellSlotProps {
    /** Whether this cell is currently being edited */
    isEditing: boolean
    /** Row span for this cell (from rowSpanning config) */
    rowSpan: number
    attrs: {
      role: string
      rowspan: number | undefined
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'DataGridCell', inheritAttrs: false })

  defineSlots<{
    default: (props: DataGridCellSlotProps) => unknown
  }>()

  const attrs = useAttrs()

  const {
    as = 'td',
    renderless,
    namespace = 'v0:data-grid',
    column,
  } = defineProps<DataGridCellProps>()

  const context = useDataGridRoot(namespace)
  const row = useDataGridRow(namespace, null)

  const isEditing = toRef(() => {
    if (!column || !row?.id) return false
    const active = context.editing.active.value
    return active?.row === row.id && active?.column === column
  })

  const rowSpan = toRef(() => {
    if (!column || !row?.id) return 1
    const spanMap = context.spans.value.get(row.id)
    if (!spanMap) return 1
    const entry = spanMap.get(column)
    return entry?.rowSpan ?? 1
  })

  const isHidden = toRef(() => {
    if (!column || !row?.id) return false
    const spanMap = context.spans.value.get(row.id)
    if (!spanMap) return false
    const entry = spanMap.get(column)
    return !isUndefined(entry) && entry.hidden
  })

  const slotProps = toRef((): DataGridCellSlotProps => ({
    isEditing: isEditing.value,
    rowSpan: rowSpan.value,
    attrs: {
      role: 'gridcell',
      rowspan: rowSpan.value > 1 ? rowSpan.value : undefined,
    },
  }))
</script>

<template>
  <Atom
    v-if="!isHidden"
    :as
    :renderless
    v-bind="mergeProps(attrs, slotProps.attrs)"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
