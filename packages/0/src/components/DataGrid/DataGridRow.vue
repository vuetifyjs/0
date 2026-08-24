<script lang="ts">
  /**
   * @module DataGridRow
   *
   * @see https://0.vuetifyjs.com/components/data/data-grid
   *
   * @remarks
   * A `<tr>` element. Use inside DataGrid.Header (with Column) or
   * DataGrid.Body (with Cell). Exposes selection and expansion state
   * when bound to a row item.
   *
   * When `resizable` is true, the row composes `Splitter.Root` so child
   * columns register as `Splitter.Panel`. Splitter cannot live in a native
   * table — pass `as="div"` on the Table/Header/Body/Row/Column/Cell chain.
   */

  // Components
  import { Atom } from '#v0/components/Atom'
  import { SplitterRoot } from '#v0/components/Splitter'

  // Context
  import { useDataGridRoot } from './DataGridRoot.vue'

  // Composables
  import { createContext } from '#v0/composables/createContext'

  // Utilities
  import { isUndefined } from '#v0/utilities'
  import { mergeProps, onBeforeUnmount, toRef, useAttrs } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { ID } from '#v0/types'
  import type { Ref } from 'vue'

  export interface DataGridRowContext {
    id: Readonly<Ref<ID | undefined>>
    resizable: Readonly<Ref<boolean>>
  }

  export const [useDataGridRow, provideDataGridRow] = createContext<DataGridRowContext | null>({ suffix: 'row' })

  export interface DataGridRowProps extends AtomProps {
    /** Namespace for dependency injection. @default 'v0:data-grid' */
    namespace?: string
    /** Row identifier. Registers a data ticket when set with `value`. */
    id?: ID
    /** Row value to register. Omit on header rows. */
    value?: Record<string, unknown>
    /** 1-based aria-rowindex. Bind `headerRows + i + 1` when v-for `orderedItems`, or `rowStart + i` when v-for `items`. */
    index?: number
    /** Emit aria-selected. @default false */
    selectable?: boolean
    /**
     * Enable column resizing via Splitter composition.
     * When true, the row renders as Splitter.Root and child columns
     * register as Splitter.Panel. Place DataGrid.Handle between columns.
     * Requires the `as="div"` chain — native table tags cannot host Splitter.
     */
    resizable?: boolean
  }

  export interface DataGridRowSlotProps {
    id: ID | undefined
    /** Whether this row has resizable columns */
    isResizable: boolean
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
  defineOptions({ name: 'DataGridRow', inheritAttrs: false })

  defineSlots<{
    default: (props: DataGridRowSlotProps) => unknown
  }>()

  const {
    as = 'tr',
    namespace = 'v0:data-grid',
    id,
    value,
    index,
    selectable = false,
    resizable = false,
    renderless,
  } = defineProps<DataGridRowProps>()

  const attrs = useAttrs()
  const context = useDataGridRoot(namespace)

  provideDataGridRow(namespace, {
    id: toRef(() => id),
    resizable: toRef(() => resizable),
  })

  const ticket = !isUndefined(value) && (isUndefined(id) || !context.has(id))
    ? context.register({ id, value })
    : undefined

  onBeforeUnmount(() => {
    if (ticket) context.unregister(ticket.id)
  })

  function rowId () {
    return ticket?.id ?? id
  }

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
    if (!isUndefined(current)) {
      context.selection.toggle(current)
    }
  }

  function toggleExpansion () {
    const current = rowId()
    if (!isUndefined(current)) {
      context.expansion.toggle(current)
    }
  }

  function onSplitterLayout (sizes: number[]) {
    if (sizes.length !== context.layout.columns.value.length) return
    context.layout.distribute(sizes)
  }

  const slotProps = toRef((): DataGridRowSlotProps => ({
    id,
    isResizable: resizable,
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
    },
  }))
</script>

<template>
  <component
    :is="resizable ? SplitterRoot : Atom"
    v-bind="resizable
      ? mergeProps(attrs, slotProps.attrs, { orientation: 'horizontal', as, renderless, onLayout: onSplitterLayout })
      : mergeProps(attrs, slotProps.attrs, { as, renderless })"
  >
    <slot v-bind="slotProps" />
  </component>
</template>
