/**
 * @module SplitterPanel
 *
 * @remarks
 * Resizable panel within a splitter layout. Registers with the parent
 * SplitterRoot and receives its size from the shared sizes array.
 * Sized via flex-basis percentage.
 */

<script lang="ts">
  // Components
  import { useSplitterRoot } from './SplitterRoot.vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { SplitterOrientation } from './SplitterRoot.vue'

  export interface SplitterPanelProps extends AtomProps {
    defaultSize: number
    minSize?: number
    maxSize?: number
  }

  export interface SplitterPanelSlotProps {
    size: number
    attrs: {
      'id': string
      'data-orientation': SplitterOrientation
      'data-panel-index': number
    }
  }
</script>

<script setup lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Utilities
  import { useId } from '#v0/utilities'
  import { onUnmounted, toRef, useAttrs, watchEffect } from 'vue'

  defineOptions({ name: 'SplitterPanel', inheritAttrs: false })

  const attrs = useAttrs()

  defineSlots<{
    default: (props: SplitterPanelSlotProps) => any
  }>()

  const {
    as = 'div',
    renderless,
    defaultSize,
    minSize = 0,
    maxSize = 100,
  } = defineProps<SplitterPanelProps>()

  const splitter = useSplitterRoot()
  const panelId = useId()

  // Panel registration uses array indices — assumes static panel ordering
  const index = splitter.register({ minSize, maxSize }, defaultSize, panelId)

  watchEffect(() => {
    const panel = splitter.panels.value[index]
    if (panel) {
      panel.minSize = minSize
      panel.maxSize = maxSize
    }
  })

  onUnmounted(() => {
    splitter.unregister(index)
  })

  const size = toRef(() => splitter.sizes.value[index] ?? defaultSize)

  const slotProps = toRef((): SplitterPanelSlotProps => ({
    size: size.value,
    attrs: {
      'id': panelId,
      'data-orientation': splitter.orientation.value,
      'data-panel-index': index,
    },
  }))
</script>

<template>
  <Atom
    v-bind="{ ...attrs, ...slotProps.attrs }"
    :as
    :renderless
    :style="{
      flexGrow: 0,
      flexShrink: 0,
      flexBasis: `${size}%`,
      overflow: 'hidden',
    }"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
