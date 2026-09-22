<script lang="ts">
  /**
   * @module DataTableRow
   *
   * @see https://0.vuetifyjs.com/components/data/data-table
   *
   * @remarks
   * A `<tr>` element. Use inside DataTable.Header (with Column) or
   * DataTable.Body (with Cell). Exposes selection and expansion state
   * when bound to a row item.
   */

  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useDataTableRoot } from './DataTableRoot.vue'

  // Utilities
  import { isUndefined } from '#v0/utilities'
  import { mergeProps, onBeforeUnmount, toRef, useAttrs, watch } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { ID } from '#v0/types'

  export interface DataTableRowProps extends AtomProps {
    /** Namespace for dependency injection. @default 'v0:data-table' */
    namespace?: string
    /** Row identifier. Registers a data ticket when set with `value`. */
    id?: ID
    /** Row value to register. Omit on header rows. */
    value?: object
    /** 1-based aria-rowindex. Defaults to the row's position in sortedItems. */
    index?: number
    /** Emit aria-selected. @default false */
    selectable?: boolean
  }

  export interface DataTableRowSlotProps {
    /** Registered row id */
    id: ID | undefined
    /** Registered row record. Undefined on header rows. */
    value: object | undefined
    /** Whether this row is selected */
    isSelected: boolean
    /** Whether this row is selectable */
    isSelectable: boolean
    /** Whether this row is expanded */
    isExpanded: boolean
    /** Whether this data row is on the current page. Header rows are always visible. */
    isVisible: boolean
    /** Toggle row selection */
    toggleSelection: () => void
    /** Toggle row expansion */
    toggleExpansion: () => void
    attrs: {
      'role': 'row'
      'aria-selected': boolean | undefined
      'aria-rowindex': number | undefined
      'data-selected': true | undefined
      'data-expanded': true | undefined
      'onClick': (() => void) | undefined
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'DataTableRow', inheritAttrs: false })

  defineSlots<{
    default: (props: DataTableRowSlotProps) => unknown
  }>()

  const {
    as = 'tr',
    namespace = 'v0:data-table',
    id,
    value,
    index,
    selectable = false,
    renderless,
  } = defineProps<DataTableRowProps>()

  const attrs = useAttrs()
  const context = useDataTableRoot(namespace)

  const ticket = !isUndefined(value) && (isUndefined(id) || !context.has(id))
    ? context.register({ id, value })
    : undefined

  if (ticket) {
    watch(() => value, next => {
      if (!isUndefined(next)) context.upsert(ticket.id, { value: next })
    })
  }

  onBeforeUnmount(() => {
    if (ticket) context.unregister(ticket.id)
  })

  function rowId () {
    return ticket?.id ?? id
  }

  function isHeaderRow () {
    return isUndefined(ticket) && isUndefined(value) && (isUndefined(id) || !context.has(id))
  }

  const record = toRef((): object | undefined => {
    if (!isUndefined(value)) return value

    const current = rowId()
    if (isUndefined(current)) return undefined

    return context.get(current)?.value
  })

  function matches (item: object) {
    const rec = record.value
    if (!isUndefined(rec) && item === rec) return true
    const current = rowId()
    return !isUndefined(current) && (item as Record<string, unknown>).id === current
  }

  const isVisible = toRef(() => {
    if (isHeaderRow()) return true
    return context.items.value.some(item => matches(item))
  })

  const rowIndex = toRef((): number | undefined => {
    if (!isUndefined(index)) return index
    if (isHeaderRow()) return undefined

    const pos = context.sortedItems.value.findIndex(item => matches(item))
    if (pos === -1) return undefined

    return context.headers.value.length + pos + 1
  })

  const isSelected = toRef(() => {
    const current = rowId()
    if (isUndefined(current)) return false
    return context.selection.isSelected(current)
  })

  const isSelectable = toRef(() => {
    const current = rowId()
    if (isUndefined(current)) return false
    return context.selection.isSelectable(current)
  })

  const isExpanded = toRef(() => {
    const current = rowId()
    if (isUndefined(current)) return false
    return context.expansion.isExpanded(current)
  })

  function toggleSelection () {
    const current = rowId()
    if (isUndefined(current) || !isSelectable.value) return
    context.selection.toggle(current)
  }

  function onClick () {
    if (!selectable) return
    toggleSelection()
  }

  function toggleExpansion () {
    const current = rowId()
    if (!isUndefined(current)) {
      context.expansion.toggle(current)
    }
  }

  const slotProps = toRef((): DataTableRowSlotProps => ({
    id: rowId(),
    value: record.value,
    isSelected: isSelected.value,
    isSelectable: isSelectable.value,
    isExpanded: isExpanded.value,
    isVisible: isVisible.value,
    toggleSelection,
    toggleExpansion,
    attrs: {
      'role': 'row',
      'aria-selected': selectable && !isUndefined(rowId()) ? isSelected.value : undefined,
      'aria-rowindex': rowIndex.value,
      'data-selected': isSelected.value || undefined,
      'data-expanded': isExpanded.value || undefined,
      'onClick': selectable ? onClick : undefined,
    },
  }))
</script>

<template>
  <Atom
    v-show="isVisible"
    :as
    :renderless
    v-bind="mergeProps(attrs, slotProps.attrs)"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
