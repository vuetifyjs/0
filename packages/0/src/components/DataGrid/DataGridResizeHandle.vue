/**
 * @module DataGridResizeHandle
 *
 * @see https://0.vuetifyjs.com/components/data/data-grid
 *
 * @remarks
 * Draggable resize handle for data grid columns. Implements the WAI-ARIA
 * window splitter pattern with pointer drag and keyboard support. Composes
 * the same interaction mechanics as Splitter.Handle but maps resize deltas
 * to the grid's column layout.
 *
 * Place between adjacent DataGridColumn elements in the header row. The handle
 * resizes the column identified by the `column` prop; the next column in
 * display order absorbs the inverse delta.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useDataGridRoot } from './DataGridRoot.vue'

  // Composables
  import { useDocumentEventListener } from '#v0/composables/useEventListener'
  import { useLocale } from '#v0/composables/useLocale'
  import { useRaf } from '#v0/composables/useRaf'
  import { useToggleScope } from '#v0/composables/useToggleScope'

  // Constants
  import { IN_BROWSER } from '#v0/constants/globals'

  // Utilities
  import { isNullOrUndefined } from '#v0/utilities'
  import { mergeProps, onScopeDispose, shallowRef, toRef, useAttrs } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface DataGridResizeHandleProps extends AtomProps {
    /** Namespace for dependency injection. @default 'v0:data-grid' */
    namespace?: string
    /** Column identifier to resize (the column to the left of this handle) */
    column: string
    /** Whether the handle is disabled */
    disabled?: boolean
    /** Accessible label for the resize handle */
    label?: string
  }

  export type DataGridResizeHandleState = 'drag' | 'hover' | 'inactive'

  export interface DataGridResizeHandleSlotProps {
    /** Whether the handle is currently being dragged */
    isDragging: boolean
    /** Whether the handle is disabled */
    isDisabled: boolean
    /** Whether the column is resizable */
    isResizable: boolean
    /** Current drag/hover state */
    state: DataGridResizeHandleState
    /** Current size of the column being resized (percentage) */
    size: number
    /** Minimum size allowed (percentage) */
    minSize: number
    /** Maximum size allowed (percentage) */
    maxSize: number
    attrs: {
      'role': 'separator'
      'tabindex': 0 | -1
      'aria-valuenow': number
      'aria-valuemin': number
      'aria-valuemax': number
      'aria-orientation': 'vertical'
      'aria-controls': string | undefined
      'aria-label': string | undefined
      'aria-disabled': boolean
      'data-state': DataGridResizeHandleState
      'data-orientation': 'horizontal'
      'data-disabled': true | undefined
      'data-column': string
      'style': Record<string, string>
      'onPointerdown': (e: PointerEvent) => void
      'onPointerenter': () => void
      'onPointerleave': () => void
      'onKeydown': (e: KeyboardEvent) => void
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'DataGridResizeHandle', inheritAttrs: false })

  const attrs = useAttrs()

  defineSlots<{
    default: (props: DataGridResizeHandleSlotProps) => any
  }>()

  const {
    as = 'div',
    renderless,
    namespace = 'v0:data-grid',
    column,
    disabled = false,
    label,
  } = defineProps<DataGridResizeHandleProps>()

  const ARROW_STEP = 1
  const PAGE_STEP = 10

  const locale = useLocale()
  const context = useDataGridRoot(namespace)

  const hovering = shallowRef(false)
  const dragging = shallowRef(false)
  const startPosition = shallowRef(0)
  let latestPos = 0

  const resolvedColumn = toRef(() => {
    return context.layout.columns.value.find(c => c.id === column)
  })

  const isResizable = toRef(() => {
    const col = resolvedColumn.value
    if (col) return col.resizable
    const ticket = context.columns.get(column)
    return ticket?.resizable ?? true
  })

  const isDisabled = toRef(() => disabled || !isResizable.value)

  const state = toRef((): DataGridResizeHandleState => {
    if (dragging.value) return 'drag'
    if (hovering.value) return 'hover'
    return 'inactive'
  })

  const size = toRef(() => resolvedColumn.value?.size ?? 0)
  const minSize = toRef(() => resolvedColumn.value?.minSize ?? 2)
  const maxSize = toRef(() => {
    const col = resolvedColumn.value
    if (!col) return 100
    const columns = context.layout.columns.value
    const colIndex = columns.findIndex(c => c.id === column)
    if (colIndex === -1 || colIndex >= columns.length - 1) return col.maxSize
    const neighbor = columns[colIndex + 1]
    if (!neighbor) return col.maxSize
    const neighborMin = neighbor.minSize
    return Math.min(col.maxSize, col.size + neighbor.size - neighborMin)
  })

  function onPointerDown (e: PointerEvent) {
    if (isDisabled.value) return

    const target = e.currentTarget as Element
    target.setPointerCapture(e.pointerId)
    startPosition.value = e.clientX
    if (IN_BROWSER) {
      document.documentElement.style.userSelect = 'none'
      document.documentElement.style.touchAction = 'none'
    }
    dragging.value = true
  }

  useToggleScope(() => dragging.value, () => {
    const update = useRaf(() => {
      const table = document.querySelector(`[role="grid"]`)
      if (!table) return

      const rootSize = (table as HTMLElement).offsetWidth
      if (!rootSize) return

      const delta = ((latestPos - startPosition.value) / rootSize) * 100
      startPosition.value = latestPos

      context.layout.resize(column, delta)
    })

    useDocumentEventListener('pointermove', (e: PointerEvent) => {
      latestPos = e.clientX
      update()
    })

    useDocumentEventListener('pointerup', () => {
      update.cancel()
      if (IN_BROWSER) {
        document.documentElement.style.userSelect = ''
        document.documentElement.style.touchAction = ''
      }
      dragging.value = false
    })

    onScopeDispose(() => {
      dragging.value = false
      if (IN_BROWSER) {
        document.documentElement.style.userSelect = ''
        document.documentElement.style.touchAction = ''
      }
    })
  })

  function onKeydown (e: KeyboardEvent) {
    if (isDisabled.value) return

    switch (e.key) {
      case 'ArrowRight': {
        e.preventDefault()
        context.layout.resize(column, ARROW_STEP)
        break
      }
      case 'ArrowLeft': {
        e.preventDefault()
        context.layout.resize(column, -ARROW_STEP)
        break
      }
      case 'PageDown': {
        e.preventDefault()
        context.layout.resize(column, PAGE_STEP)
        break
      }
      case 'PageUp': {
        e.preventDefault()
        context.layout.resize(column, -PAGE_STEP)
        break
      }
      case 'Home': {
        e.preventDefault()
        const current = size.value
        context.layout.resize(column, minSize.value - current)
        break
      }
      case 'End': {
        e.preventDefault()
        const current = size.value
        context.layout.resize(column, maxSize.value - current)
        break
      }
      // No default
    }
  }

  function onPointerEnter () {
    hovering.value = true
  }

  function onPointerLeave () {
    hovering.value = false
  }

  const ariaControls = toRef(() => {
    const col = resolvedColumn.value
    return isNullOrUndefined(col) ? undefined : `column-${col.id}`
  })

  const slotProps = toRef((): DataGridResizeHandleSlotProps => ({
    isDragging: dragging.value,
    isDisabled: isDisabled.value,
    isResizable: isResizable.value,
    state: state.value,
    size: size.value,
    minSize: minSize.value,
    maxSize: maxSize.value,
    attrs: {
      'role': 'separator',
      'tabindex': isDisabled.value ? -1 : 0,
      'aria-valuenow': Math.round(size.value),
      'aria-valuemin': minSize.value,
      'aria-valuemax': maxSize.value,
      'aria-orientation': 'vertical',
      'aria-controls': ariaControls.value,
      'aria-label': label || (locale.ti('DataGrid.resizeHandle') ?? `Resize ${column} column`),
      'aria-disabled': isDisabled.value,
      'data-state': state.value,
      'data-orientation': 'horizontal',
      'data-disabled': isDisabled.value || undefined,
      'data-column': column,
      'style': { 'touch-action': 'none' },
      'onPointerdown': onPointerDown,
      'onPointerenter': onPointerEnter,
      'onPointerleave': onPointerLeave,
      'onKeydown': onKeydown,
    },
  }))
</script>

<template>
  <Atom
    v-if="isResizable"
    v-bind="mergeProps(attrs, slotProps.attrs)"
    :as
    :renderless
    :style="[attrs.style, slotProps.attrs.style, { flexShrink: 0 }]"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
