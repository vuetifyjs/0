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

  export interface SplitterPanelProps extends AtomProps {
    defaultSize: number
    minSize?: number
    maxSize?: number
  }

  export interface SplitterPanelSlotProps {
    size: number
    attrs: {
      'data-orientation': string
      'data-panel-index': number
    }
  }
</script>

<script setup lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Utilities
  import { onUnmounted, toRef, useAttrs } from 'vue'

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

  const index = splitter.register({ minSize, maxSize }, defaultSize)

  onUnmounted(() => {
    splitter.unregister(index)
  })

  const size = toRef(() => splitter.sizes.value[index] ?? defaultSize)

  const slotProps = toRef((): SplitterPanelSlotProps => ({
    size: size.value,
    attrs: {
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
