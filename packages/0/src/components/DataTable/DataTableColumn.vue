<script lang="ts">
  /**
   * @module DataTableColumn
   *
   * @see https://0.vuetifyjs.com/components/data/data-table
   *
   * @remarks
   * A `<th>` element for header cells. Exposes sort state and controls
   * for sortable columns. Use inside DataTable.Row.
   */

  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useDataTableRoot } from './DataTableRoot.vue'

  // Utilities
  import { isUndefined } from '#v0/utilities'
  import { mergeProps, onBeforeUnmount, toRef, toValue, useAttrs } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { SortDirection } from '#v0/composables/createDataTable'

  export interface DataTableColumnProps extends AtomProps {
    /** Namespace for dependency injection. @default 'v0:data-table' */
    namespace?: string
    /** Column id — registers this header with the table when set */
    id?: string
    /** Participate in the sort pipeline */
    sortable?: boolean
    /** Participate in the filter pipeline */
    filterable?: boolean
    /** Number of columns this cell spans */
    colspan?: number
    /** Number of rows this cell spans */
    rowspan?: number
  }

  export interface DataTableColumnSlotProps {
    /** Whether this column is sortable */
    isSortable: boolean
    /** Current sort direction: 'asc' | 'desc' | 'none' */
    direction: SortDirection
    /** Sort priority index (0-based), or -1 if not sorted */
    priority: number
    /** Toggle sort for this column */
    toggle: () => void
    attrs: {
      'role': 'columnheader'
      'scope': 'col' | 'colgroup'
      'aria-sort': 'ascending' | 'descending' | 'none' | undefined
      'data-direction': 'asc' | 'desc' | undefined
      'colspan': number | undefined
      'rowspan': number | undefined
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'DataTableColumn', inheritAttrs: false })

  defineSlots<{
    default: (props: DataTableColumnSlotProps) => unknown
  }>()

  const {
    as = 'th',
    namespace = 'v0:data-table',
    id,
    sortable = false,
    filterable = false,
    colspan,
    rowspan,
    renderless,
  } = defineProps<DataTableColumnProps>()

  const attrs = useAttrs()
  const context = useDataTableRoot(namespace)

  const ticket = !isUndefined(id) && !context.columns.has(id)
    ? context.columns.register({
      id,
      sortable: () => toValue(sortable) ?? false,
      filterable: () => toValue(filterable) ?? false,
    })
    : undefined

  onBeforeUnmount(() => {
    if (ticket) context.columns.unregister(ticket.id)
  })

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

  const ariaSort = toRef((): 'ascending' | 'descending' | 'none' | undefined => {
    if (!isSortable.value) return undefined
    const dir = direction.value
    if (dir === 'asc') return 'ascending'
    if (dir === 'desc') return 'descending'
    return 'none'
  })

  const slotProps = toRef((): DataTableColumnSlotProps => ({
    isSortable: isSortable.value,
    direction: direction.value,
    priority: priority.value,
    toggle,
    attrs: {
      'role': 'columnheader',
      'scope': (colspan ?? 1) > 1 ? 'colgroup' : 'col',
      'aria-sort': ariaSort.value,
      'data-direction': isSortable.value && (direction.value === 'asc' || direction.value === 'desc')
        ? direction.value
        : undefined,
      'colspan': colspan,
      'rowspan': rowspan,
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
