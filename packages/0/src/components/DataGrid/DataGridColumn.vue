/**
 * @module DataGridColumn
 *
 * @see https://0.vuetifyjs.com/components/data/data-grid
 *
 * @remarks
 * Header cell component for the data grid. Renders as th by default
 * with role="columnheader" for ARIA grid semantics. Exposes sorting
 * state and column layout information from the grid context.
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

  export interface DataGridColumnProps extends AtomProps {
    /** Namespace for dependency injection. @default 'v0:data-grid' */
    namespace?: string
    /** Column identifier for sorting and layout */
    column?: string
  }

  export interface DataGridColumnSlotProps {
    /** Whether this column is currently sorted */
    isSorted: boolean
    /** Sort direction: 'asc', 'desc', or undefined */
    sortDirection: 'asc' | 'desc' | undefined
    /** Whether this column is pinned */
    isPinned: boolean
    /** Pin position: 'left', 'right', or false */
    pinPosition: 'left' | 'right' | false
    /** Whether this column is resizable */
    isResizable: boolean
    /** Current column size as a percentage */
    size: number
    /** Minimum size as a percentage */
    minSize: number
    /** Maximum size as a percentage */
    maxSize: number
    /** Offset from the pinning edge (for sticky positioning) */
    offset: number
    attrs: {
      'role': string
      'aria-sort': 'ascending' | 'descending' | 'none' | undefined
      'style'?: Record<string, string>
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'DataGridColumn', inheritAttrs: false })

  defineSlots<{
    default: (props: DataGridColumnSlotProps) => unknown
  }>()

  const attrs = useAttrs()

  const {
    as = 'th',
    renderless,
    namespace = 'v0:data-grid',
    column,
  } = defineProps<DataGridColumnProps>()

  const context = useDataGridRoot(namespace)

  const isSorted = toRef(() => {
    if (!column) return false
    return context.sort.columns.value.some(c => c.key === column && c.direction !== 'none')
  })

  const sortDirection = toRef((): 'asc' | 'desc' | undefined => {
    if (!column) return undefined
    const sortCol = context.sort.columns.value.find(c => c.key === column)
    if (!sortCol || sortCol.direction === 'none') return undefined
    return sortCol.direction
  })

  const isPinned = toRef(() => {
    if (!column) return false
    const colTicket = context.columns.get(column)
    return colTicket?.pinned === 'left' || colTicket?.pinned === 'right'
  })

  const pinPosition = toRef((): 'left' | 'right' | false => {
    if (!column) return false
    const colTicket = context.columns.get(column)
    if (colTicket?.pinned === 'left' || colTicket?.pinned === 'right') {
      return colTicket.pinned
    }
    return false
  })

  const resolvedColumn = toRef(() => {
    if (!column) return undefined
    return context.layout.columns.value.find(c => c.id === column)
  })

  const isResizable = toRef(() => resolvedColumn.value?.resizable ?? true)

  const size = toRef(() => resolvedColumn.value?.size ?? 0)

  const minSize = toRef(() => resolvedColumn.value?.minSize ?? 2)

  const maxSize = toRef(() => resolvedColumn.value?.maxSize ?? 100)

  const offset = toRef(() => resolvedColumn.value?.offset ?? 0)

  const ariaSort = toRef((): 'ascending' | 'descending' | 'none' | undefined => {
    if (!column) return undefined
    const dir = sortDirection.value
    if (dir === 'asc') return 'ascending'
    if (dir === 'desc') return 'descending'
    return 'none'
  })

  const slotProps = toRef((): DataGridColumnSlotProps => ({
    isSorted: isSorted.value,
    sortDirection: sortDirection.value,
    isPinned: isPinned.value,
    pinPosition: pinPosition.value,
    isResizable: isResizable.value,
    size: size.value,
    minSize: minSize.value,
    maxSize: maxSize.value,
    offset: offset.value,
    attrs: {
      'role': 'columnheader',
      'aria-sort': ariaSort.value,
      'style': size.value > 0 ? { width: `${size.value}%` } : undefined,
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
