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
  import { mergeProps, toRef, useAttrs } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { ID } from '#v0/types'

  export interface DataTableRowProps extends AtomProps {
    /** Namespace for dependency injection. @default 'v0:data-table' */
    namespace?: string
    /** Row identifier for selection/expansion binding — the ticket id used at onboard */
    id?: ID
    /** 1-based aria-rowindex. Bind `rowStart + i` from Body when aria-rowcount is set. */
    index?: number
    /** Emit aria-selected. @default false */
    selectable?: boolean
  }

  export interface DataTableRowSlotProps {
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
    index,
    selectable = false,
    renderless,
  } = defineProps<DataTableRowProps>()

  const attrs = useAttrs()
  const context = useDataTableRoot(namespace)

  const isSelected = toRef(() => {
    if (isUndefined(id)) return false
    return context.selection.isSelected(id)
  })

  const isSelectable = toRef(() => {
    if (isUndefined(id)) return false
    return context.selection.isSelectable(id)
  })

  const isExpanded = toRef(() => {
    if (isUndefined(id)) return false
    return context.expansion.isExpanded(id)
  })

  function toggleSelection () {
    if (!isUndefined(id)) {
      context.selection.toggle(id)
    }
  }

  function toggleExpansion () {
    if (!isUndefined(id)) {
      context.expansion.toggle(id)
    }
  }

  const slotProps = toRef((): DataTableRowSlotProps => ({
    isSelected: isSelected.value,
    isSelectable: isSelectable.value,
    isExpanded: isExpanded.value,
    toggleSelection,
    toggleExpansion,
    attrs: {
      'role': 'row',
      'aria-selected': selectable && !isUndefined(id) ? isSelected.value : undefined,
      'aria-rowindex': isUndefined(index) ? undefined : index,
      'data-selected': isSelected.value || undefined,
      'data-expanded': isExpanded.value || undefined,
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
