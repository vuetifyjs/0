/**
 * @module DataGridHandle
 *
 * @see https://0.vuetifyjs.com/components/data/data-grid
 *
 * @remarks
 * Column resize handle for the data grid. This is a thin wrapper around
 * Splitter.Handle that provides the drag interaction for column resizing.
 *
 * Place between adjacent DataGridColumn components inside a resizable
 * DataGridRow. The handle inherits all Splitter.Handle functionality
 * including pointer drag and keyboard support (Arrow keys, Page Up/Down,
 * Home/End).
 */

<script lang="ts">
  // Components
  import { SplitterHandle } from '#v0/components/Splitter'

  // Composables
  import { useLocale } from '#v0/composables/useLocale'

  // Utilities
  import { toRef, useAttrs } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { SplitterHandleSlotProps } from '#v0/components/Splitter'

  export interface DataGridHandleProps extends AtomProps {
    /** Whether the handle is disabled */
    disabled?: boolean
    /** Accessible label for the resize handle */
    label?: string
  }

  export type DataGridHandleState = 'drag' | 'hover' | 'inactive'

  export interface DataGridHandleSlotProps {
    /** Whether the handle is currently being dragged */
    isDragging: boolean
    /** Whether the handle is disabled */
    isDisabled: boolean
    /** Current drag/hover state */
    state: DataGridHandleState
    /** All ARIA and interaction attributes from Splitter.Handle */
    attrs: SplitterHandleSlotProps['attrs']
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'DataGridHandle', inheritAttrs: false })

  const attrs = useAttrs()

  defineSlots<{
    default: (props: DataGridHandleSlotProps) => unknown
  }>()

  const {
    as = 'div',
    renderless,
    disabled = false,
    label,
  } = defineProps<DataGridHandleProps>()

  const locale = useLocale()

  const resolvedLabel = toRef(() =>
    label ?? locale.ti('DataGrid.resizeHandle') ?? 'Resize column',
  )
</script>

<template>
  <SplitterHandle
    v-slot="handleProps"
    v-bind="attrs"
    :as
    :disabled
    :label="resolvedLabel"
    :renderless
  >
    <slot
      :attrs="handleProps.attrs"
      :is-disabled="handleProps.isDisabled"
      :is-dragging="handleProps.isDragging"
      :state="handleProps.state"
    />
  </SplitterHandle>
</template>
