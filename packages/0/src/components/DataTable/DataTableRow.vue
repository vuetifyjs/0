<script lang="ts">
  /**
   * @module DataTableRow
   *
   * @see https://0.vuetifyjs.com/components/data/data-table
   *
   * @remarks
   * A `<tr>` element for data rows. Exposes selection and expansion state
   * when bound to a row item. Use inside DataTable.Body.
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
    /** Row identifier for selection/expansion binding */
    rowId?: ID
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
    rowId,
    renderless,
  } = defineProps<DataTableRowProps>()

  const attrs = useAttrs()
  const context = useDataTableRoot(namespace)

  const isSelected = toRef(() => {
    if (isUndefined(rowId)) return false
    return context.selection.isSelected(rowId)
  })

  const isSelectable = toRef(() => {
    if (isUndefined(rowId)) return false
    return context.selection.isSelectable(rowId)
  })

  const isExpanded = toRef(() => {
    if (isUndefined(rowId)) return false
    return context.expansion.isExpanded(rowId)
  })

  function toggleSelection () {
    if (!isUndefined(rowId)) {
      context.selection.toggle(rowId)
    }
  }

  function toggleExpansion () {
    if (!isUndefined(rowId)) {
      context.expansion.toggle(rowId)
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
      'aria-selected': isUndefined(rowId) ? undefined : isSelected.value,
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
