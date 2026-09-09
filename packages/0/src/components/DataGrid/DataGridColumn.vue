<script lang="ts">
  /**
   * @module DataGridColumn
   *
   * @see https://0.vuetifyjs.com/components/data/data-grid
   *
   * @remarks
   * A `<th>` element for header cells. Exposes sort state, pin, and layout
   * information from the grid context. Registers on mount when `id` is set.
   *
   * When inside a resizable `DataGridRow`, this component composes
   * `Splitter.Panel`. Keep the consumer `as` — do not swap `th` for `div`.
   */

  // Components
  import { Atom } from '#v0/components/Atom'
  import { SplitterPanel } from '#v0/components/Splitter'

  // Context
  import { useDataGridRoot } from './DataGridRoot.vue'
  import { useDataGridRow } from './DataGridRow.vue'

  // Utilities
  import { isUndefined } from '#v0/utilities'
  import { mergeProps, onBeforeUnmount, toRef, toValue, useAttrs } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { PinPosition } from '#v0/composables/createDataGrid'
  import type { SortDirection } from '#v0/composables/createDataTable'

  export interface DataGridColumnProps extends AtomProps {
    /** Namespace for dependency injection. @default 'v0:data-grid' */
    namespace?: string
    /** Column id — registers this header with the grid when set */
    id?: string
    /** Participate in the sort pipeline */
    sortable?: boolean
    /** Participate in the filter pipeline */
    filterable?: boolean
    /** Width as a percentage (0–100) */
    size?: number
    /** Minimum width as a percentage */
    minSize?: number
    /** Maximum width as a percentage */
    maxSize?: number
    /** Pin position */
    pinned?: PinPosition
    /** Allow resizing */
    resizable?: boolean
    /** Whether cells in this column can be edited */
    editable?: boolean
    /** Validate a committed edit. Return `true` or an error string. */
    validate?: (value: unknown) => string | true
    /** Number of columns this cell spans */
    colspan?: number
    /** Number of rows this cell spans */
    rowspan?: number
  }

  export interface DataGridColumnSlotProps {
    /** Whether this column is sortable */
    isSortable: boolean
    /** Current sort direction: 'asc' | 'desc' | 'none' */
    direction: SortDirection
    /** Sort priority index (0-based), or -1 if not sorted */
    priority: number
    /** Toggle sort for this column */
    toggle: () => void
    /** Whether this column is pinned */
    isPinned: boolean
    /** Pin position: 'left', 'right', or false */
    pinPosition: PinPosition
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
      'role': 'columnheader'
      'scope': 'col' | 'colgroup' | undefined
      'aria-sort': 'ascending' | 'descending' | 'none' | undefined
      'data-direction': 'asc' | 'desc' | undefined
      'colspan': number | undefined
      'rowspan': number | undefined
      'aria-colspan': number | undefined
      'aria-rowspan': number | undefined
      'style'?: Record<string, string>
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'DataGridColumn', inheritAttrs: false })

  defineSlots<{
    default: (props: DataGridColumnSlotProps) => unknown
  }>()

  const {
    as = 'th',
    namespace = 'v0:data-grid',
    id,
    sortable,
    filterable,
    size: _size,
    minSize: _minSize,
    maxSize: _maxSize,
    pinned,
    resizable = true,
    editable,
    validate,
    colspan,
    rowspan,
    renderless,
  } = defineProps<DataGridColumnProps>()

  const attrs = useAttrs()
  const context = useDataGridRoot(namespace)
  const rowContext = useDataGridRow(namespace, null)

  const ticket = !isUndefined(id) && !context.columns.has(id)
    ? context.columns.register({
      id,
      sortable: () => toValue(sortable) ?? false,
      filterable: () => toValue(filterable) ?? false,
      size: _size,
      minSize: _minSize,
      maxSize: _maxSize,
      pinned,
      resizable,
      editable,
      validate,
    })
    : undefined

  if (!isUndefined(id)) rowContext?.registerColumn(id)

  onBeforeUnmount(() => {
    if (ticket) context.columns.unregister(ticket.id)
    if (!isUndefined(id)) rowContext?.unregisterColumn(id)
  })

  const inResizableRow = toRef(() => toValue(rowContext?.resizable) ?? false)

  const isSortable = toRef(() => {
    if (!id) return false
    return context.leaves.value.some(col => col.id === id && toValue(col.sortable) === true)
  })

  const direction = toRef((): SortDirection => {
    if (!id) return 'none'
    return context.sort.direction(id)
  })

  const priority = toRef(() => {
    if (!id) return -1
    return context.sort.priority(id)
  })

  function toggle () {
    if (id && isSortable.value) {
      context.sort.toggle(id)
    }
  }

  const resolvedColumn = toRef(() => {
    if (!id) return undefined
    return context.layout.columns.value.find(c => c.id === id)
  })

  const pinPosition = toRef((): PinPosition => {
    const pos = resolvedColumn.value?.pinned
    if (pos === 'left' || pos === 'right') return pos
    return false
  })

  const isPinned = toRef(() => pinPosition.value !== false)

  const isResizable = toRef(() => resolvedColumn.value?.resizable ?? true)

  const size = toRef(() => resolvedColumn.value?.size ?? 0)

  const minSize = toRef(() => resolvedColumn.value?.minSize ?? 2)

  const maxSize = toRef(() => resolvedColumn.value?.maxSize ?? 100)

  const offset = toRef(() => resolvedColumn.value?.offset ?? 0)

  const ariaSort = toRef((): 'ascending' | 'descending' | 'none' | undefined => {
    if (!isSortable.value) return undefined
    const dir = direction.value
    if (dir === 'asc') return 'ascending'
    if (dir === 'desc') return 'descending'
    return 'none'
  })

  const slotProps = toRef((): DataGridColumnSlotProps => ({
    isSortable: isSortable.value,
    direction: direction.value,
    priority: priority.value,
    toggle,
    isPinned: isPinned.value,
    pinPosition: pinPosition.value,
    isResizable: isResizable.value,
    size: size.value,
    minSize: minSize.value,
    maxSize: maxSize.value,
    offset: offset.value,
    attrs: {
      'role': 'columnheader',
      'scope': as === 'th' ? ((colspan ?? 1) > 1 ? 'colgroup' : 'col') : undefined,
      'aria-sort': ariaSort.value,
      'data-direction': isSortable.value && (direction.value === 'asc' || direction.value === 'desc')
        ? direction.value
        : undefined,
      'colspan': as === 'th' ? colspan : undefined,
      'rowspan': as === 'th' ? rowspan : undefined,
      'aria-colspan': as !== 'th' && (colspan ?? 1) > 1 ? colspan : undefined,
      'aria-rowspan': as !== 'th' && (rowspan ?? 1) > 1 ? rowspan : undefined,
      'style': size.value > 0 ? { width: `${size.value}%` } : undefined,
    },
  }))
</script>

<template>
  <component
    :is="inResizableRow ? SplitterPanel : Atom"
    v-bind="inResizableRow
      ? mergeProps(attrs, slotProps.attrs, { as, defaultSize: size, minSize, maxSize, renderless })
      : mergeProps(attrs, slotProps.attrs, { as, renderless })"
  >
    <slot v-bind="slotProps" />
  </component>
</template>
