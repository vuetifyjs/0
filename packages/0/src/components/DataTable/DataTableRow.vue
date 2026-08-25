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
  import { mergeProps, onBeforeUnmount, toRef, useAttrs } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { ID } from '#v0/types'

  export interface DataTableRowProps extends AtomProps {
    /** Namespace for dependency injection. @default 'v0:data-table' */
    namespace?: string
    /** Row identifier. Registers a data ticket when set with `value`. */
    id?: ID
    /** Row value to register. Omit on header rows. */
    value?: Record<string, unknown>
    /** 1-based aria-rowindex. Bind `rowStart + i` from Body when aria-rowcount is set. */
    index?: number
    /** Emit aria-selected. @default false */
    selectable?: boolean
  }

  export interface DataTableRowSlotProps {
    /** Registered row id */
    id: ID | undefined
    /** Registered row record. Undefined on header rows. */
    value: Record<string, unknown> | undefined
    /** Whether this row is selected */
    isSelected: boolean
    /** Whether this row is selectable */
    isSelectable: boolean
    /** Whether this row is expanded */
    isExpanded: boolean
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

  onBeforeUnmount(() => {
    if (ticket) context.unregister(ticket.id)
  })

  function rowId () {
    return ticket?.id ?? id
  }

  const record = toRef((): Record<string, unknown> | undefined => {
    if (!isUndefined(value)) return value

    const current = rowId()
    if (isUndefined(current)) return undefined

    return context.get(current)?.value
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
    toggleSelection,
    toggleExpansion,
    attrs: {
      'role': 'row',
      'aria-selected': selectable && !isUndefined(rowId()) ? isSelected.value : undefined,
      'aria-rowindex': isUndefined(index) ? undefined : index,
      'data-selected': isSelected.value || undefined,
      'data-expanded': isExpanded.value || undefined,
      'onClick': selectable ? onClick : undefined,
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
