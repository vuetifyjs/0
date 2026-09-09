<script lang="ts">
  /**
   * @module DataGridHandle
   *
   * @see https://0.vuetifyjs.com/components/data/data-grid
   *
   * @remarks
   * Column resize handle for the data grid. Thin wrapper around
   * Splitter.Handle. Only mounts inside a resizable DataGridRow — otherwise
   * renders nothing so it cannot hijack an ancestor Splitter or throw
   * V0_CONTEXT_MISSING.
   */

  // Components
  import { SplitterHandle } from '#v0/components/Splitter'

  // Context
  import { useDataGridRow } from './DataGridRow.vue'

  // Composables
  import { useLocale } from '#v0/composables/useLocale'

  // Utilities
  import { toRef, toValue, useAttrs } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { SplitterHandleSlotProps } from '#v0/components/Splitter'

  export interface DataGridHandleProps extends AtomProps {
    /** Namespace for dependency injection. @default 'v0:data-grid' */
    namespace?: string
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
    namespace = 'v0:data-grid',
    renderless,
    disabled = false,
    label,
  } = defineProps<DataGridHandleProps>()

  const row = useDataGridRow(namespace, null)
  const isResizable = toRef(() => toValue(row?.resizable) ?? false)

  const locale = useLocale()

  const resolvedLabel = toRef(() =>
    label ?? locale.ti('DataGrid.resizeHandle') ?? 'Resize column',
  )
</script>

<template>
  <SplitterHandle
    v-if="isResizable"
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
