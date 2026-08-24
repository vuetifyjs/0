<script lang="ts">
  /**
   * @module DataGridCell
   *
   * @see https://0.vuetifyjs.com/components/data/data-grid
   *
   * @remarks
   * A `<td>` element for data cells. Exposes editing state, row spanning,
   * and layout (pin/size/offset) from the grid context.
   */

  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useDataGridRoot } from './DataGridRoot.vue'
  import { useDataGridRow } from './DataGridRow.vue'

  // Utilities
  import { isUndefined } from '#v0/utilities'
  import { mergeProps, toRef, toValue, useAttrs } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { PinPosition } from '#v0/composables/createDataGrid'

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
    /** Whether this column is pinned */
    isPinned: boolean
    /** Pin position: 'left', 'right', or false */
    pinPosition: PinPosition
    /** Current column size as a percentage */
    size: number
    /** Offset from the pinning edge (for sticky positioning) */
    offset: number
    attrs: {
      'role': 'cell'
      'rowspan': number | undefined
      'aria-rowspan': number | undefined
      'aria-colindex': number | undefined
      'data-state': 'editing' | undefined
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'DataGridCell', inheritAttrs: false })

  defineSlots<{
    default: (props: DataGridCellSlotProps) => unknown
  }>()

  const {
    as = 'td',
    namespace = 'v0:data-grid',
    column,
    renderless,
  } = defineProps<DataGridCellProps>()

  const attrs = useAttrs()
  const context = useDataGridRoot(namespace)
  const row = useDataGridRow(namespace, null)

  const rowId = toRef(() => toValue(row?.id))

  const isEditing = toRef(() => {
    if (!column || isUndefined(rowId.value)) return false
    const active = context.editing.active.value
    return active?.row === rowId.value && active?.column === column
  })

  const rowSpan = toRef(() => {
    if (!column || isUndefined(rowId.value)) return 1
    const spanMap = context.spans.value.get(rowId.value)
    if (!spanMap) return 1
    const entry = spanMap.get(column)
    return entry?.rowSpan ?? 1
  })

  const isHidden = toRef(() => {
    if (!column || isUndefined(rowId.value)) return false
    const spanMap = context.spans.value.get(rowId.value)
    if (!spanMap) return false
    const entry = spanMap.get(column)
    return !isUndefined(entry) && entry.hidden
  })

  const resolvedColumn = toRef(() => {
    if (!column) return undefined
    return context.layout.columns.value.find(c => c.id === column)
  })

  const pinPosition = toRef((): PinPosition => {
    const pos = resolvedColumn.value?.pinned
    if (pos === 'left' || pos === 'right') return pos
    return false
  })

  const isPinned = toRef(() => pinPosition.value !== false)

  const size = toRef(() => resolvedColumn.value?.size ?? 0)

  const offset = toRef(() => resolvedColumn.value?.offset ?? 0)

  function colIndex () {
    if (as === 'td' || !column) return undefined
    const index = context.layout.columns.value.findIndex(c => c.id === column)
    return index === -1 ? undefined : index + 1
  }

  const slotProps = toRef((): DataGridCellSlotProps => ({
    isEditing: isEditing.value,
    rowSpan: rowSpan.value,
    isPinned: isPinned.value,
    pinPosition: pinPosition.value,
    size: size.value,
    offset: offset.value,
    attrs: {
      'role': 'cell',
      'rowspan': as === 'td' && rowSpan.value > 1 ? rowSpan.value : undefined,
      'aria-rowspan': as !== 'td' && rowSpan.value > 1 ? rowSpan.value : undefined,
      'aria-colindex': colIndex(),
      'data-state': isEditing.value ? 'editing' : undefined,
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
