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
  import { useDataGridHeader } from './DataGridHeader.vue'
  import { useDataGridRoot } from './DataGridRoot.vue'

  // Composables
  import { createContext } from '#v0/composables/createContext'

  // Utilities
  import { isUndefined } from '#v0/utilities'
  import { mergeProps, onBeforeUnmount, toRef, useAttrs, watch } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { ID } from '#v0/types'
  import type { Ref } from 'vue'

  export interface DataGridRowContext {
    id: Readonly<Ref<ID | undefined>>
    resizable: Readonly<Ref<boolean>>
    /** Record a Column id in child mount (Splitter panel) order. */
    registerColumn: (id: string) => void
    /** Drop a Column id when it unmounts. */
    unregisterColumn: (id: string) => void
  }

  export const [useDataGridRow, provideDataGridRow] = createContext<DataGridRowContext | null>({ suffix: 'row' })

  export interface DataGridRowProps extends AtomProps {
    /** Namespace for dependency injection. @default 'v0:data-grid' */
    namespace?: string
    /** Row identifier. Registers a data ticket when set with `value`. */
    id?: ID
    /** Row value to register. Omit on header rows. */
    value?: object
    /** 1-based aria-rowindex. Defaults to the row's position in orderedItems. */
    index?: number
    /** Emit aria-selected. @default false */
    selectable?: boolean
    /**
     * Enable column resizing via Splitter composition.
     * When true, the row renders as Splitter.Root and child columns
     * register as Splitter.Panel. Place DataGrid.Handle inside Column
     * (not as a sibling of Column) so the row's owned children stay
     * columnheaders. Requires the `as="div"` chain — native table tags
     * cannot host Splitter.
     */
    resizable?: boolean
  }

  export interface DataGridRowSlotProps {
    /** Registered row id */
    id: ID | undefined
    /** Registered row record. Undefined on header rows. */
    value: object | undefined
    /** Whether this row has resizable columns */
    isResizable: boolean
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
  const header = useDataGridHeader(namespace, null)

  const ticket = !isUndefined(value) && (isUndefined(id) || !context.has(id))
    ? context.register({ id, value })
    : undefined

  const panels: string[] = []

  function registerColumn (id: string) {
    panels.push(id)
  }

  function unregisterColumn (id: string) {
    const index = panels.indexOf(id)
    if (index !== -1) panels.splice(index, 1)
  }

  provideDataGridRow(namespace, {
    id: toRef(() => ticket?.id ?? id),
    resizable: toRef(() => resizable),
    registerColumn,
    unregisterColumn,
  })

  if (ticket) {
    watch(() => value, next => {
      if (!isUndefined(next)) context.upsert(ticket.id, { value: next })
    })
  }

  function rowId () {
    return ticket?.id ?? id
  }

  function isHeaderRow () {
    return isUndefined(ticket) && isUndefined(value) && (isUndefined(id) || !context.has(id))
  }

  const headerRow = header && isHeaderRow() ? header.register() : undefined

  onBeforeUnmount(() => {
    headerRow?.unregister()
    if (ticket) context.unregister(ticket.id)
  })

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
    if (isHeaderRow()) return headerRow?.index.value

    const pos = context.orderedItems.value.findIndex(item => matches(item))
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

  function onSplitterLayout (sizes: number[]) {
    const visible = new Set(context.layout.columns.value.map(c => c.id))
    const assigned = new Map<string, number>()

    for (const [index, size] of sizes.entries()) {
      const id = panels[index]
      if (isUndefined(id)) return
      assigned.set(id, size!)
    }

    const permuted: number[] = []
    for (const leaf of context.leaves.value) {
      const id = String(leaf.id)
      if (!visible.has(id)) continue
      const size = assigned.get(id)
      if (isUndefined(size)) return
      permuted.push(size)
    }

    context.layout.distribute(permuted)
  }

  const slotProps = toRef((): DataGridRowSlotProps => ({
    id: rowId(),
    value: record.value,
    isResizable: resizable,
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

  const host = toRef(() => resizable ? SplitterRoot : Atom)

  const binds = toRef(() =>
    resizable
      ? mergeProps(attrs, slotProps.value.attrs, { orientation: 'horizontal', as, renderless, onLayout: onSplitterLayout })
      : mergeProps(attrs, slotProps.value.attrs, { as, renderless }),
  )
</script>

<template>
  <component
    :is="host"
    v-if="renderless"
    v-bind="binds"
  >
    <slot v-bind="slotProps" />
  </component>

  <component
    :is="host"
    v-else
    v-show="isVisible"
    v-bind="binds"
  >
    <slot v-bind="slotProps" />
  </component>
</template>
