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
    collapsible?: boolean
    collapsedSize?: number
  }

  export interface SplitterPanelSlotProps {
    size: number
    isCollapsed: boolean
    collapse: () => void
    expand: () => void
    attrs: {
      'id': string
      'data-orientation': SplitterOrientation
      'data-panel-index': number
      'data-collapsed': true | undefined
    }
  }
</script>

<script setup lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Utilities
  import { useId } from '#v0/utilities'
  import { onUnmounted, toRef, useAttrs, watch, watchEffect } from 'vue'

  defineOptions({ name: 'SplitterPanel', inheritAttrs: false })

  const attrs = useAttrs()

  const emit = defineEmits<{
    resize: [size: number]
  }>()

  defineSlots<{
    default: (props: SplitterPanelSlotProps) => any
  }>()

  const {
    as = 'div',
    renderless,
    defaultSize,
    minSize = 0,
    maxSize = 100,
    collapsible = false,
    collapsedSize = 0,
  } = defineProps<SplitterPanelProps>()

  const splitter = useSplitterRoot()
  const panelId = useId()

  // Panel registration uses array indices — assumes static panel ordering
  const index = splitter.register(
    { minSize, maxSize, collapsible, collapsedSize, collapsed: false, defaultSize },
    defaultSize,
    panelId,
  )

  watchEffect(() => {
    const panel = splitter.panels.value[index]
    if (panel) {
      panel.minSize = minSize
      panel.maxSize = maxSize
      panel.collapsible = collapsible
      panel.collapsedSize = collapsedSize
      panel.defaultSize = defaultSize
    }
  })

  onUnmounted(() => {
    splitter.unregister(index)
  })

  const size = toRef(() => splitter.sizes.value[index] ?? defaultSize)
  const isCollapsed = toRef(() => splitter.panels.value[index]?.collapsed ?? false)

  function collapse () {
    splitter.collapsePanel(index)
    splitter.onResizeEnd()
  }

  function expand () {
    splitter.expandPanel(index)
    splitter.onResizeEnd()
  }

  watch(size, val => emit('resize', val))

  const slotProps = toRef((): SplitterPanelSlotProps => ({
    size: size.value,
    isCollapsed: isCollapsed.value,
    collapse,
    expand,
    attrs: {
      'id': panelId,
      'data-orientation': splitter.orientation.value,
      'data-panel-index': index,
      'data-collapsed': isCollapsed.value || undefined,
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
