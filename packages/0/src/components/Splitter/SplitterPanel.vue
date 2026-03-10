/**
 * @module SplitterPanel
 *
 * @remarks
 * Resizable panel within a splitter layout. Registers with the parent
 * SplitterRoot's selection context and receives its size from the ticket.
 * Sized via flex-basis percentage.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'
  import { useSplitterRoot } from './SplitterRoot.vue'

  // Utilities
  import { useId } from '#v0/utilities'
  import { onUnmounted, toRef, toValue, useAttrs, watch, watchEffect } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { SplitterOrientation } from './SplitterRoot.vue'
  import type { Ref } from 'vue'

  export interface SplitterPanelProps extends AtomProps {
    defaultSize: number
    minSize?: number
    maxSize?: number
    collapsible?: boolean
    collapsedSize?: number
  }

  export interface SplitterPanelExpose {
    collapse: () => void
    expand: () => void
    size: Ref<number>
    isCollapsed: Ref<boolean>
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
  defineOptions({ name: 'SplitterPanel', inheritAttrs: false })

  const attrs = useAttrs()

  const collapsed = defineModel<boolean>('collapsed', { default: undefined })

  const emit = defineEmits<{
    'update:collapsed': [value: boolean]
    'resize': [size: number]
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

  const ticket = splitter.panels.register({
    id: panelId,
    size: defaultSize,
    minSize,
    maxSize,
    collapsible,
    collapsedSize,
    defaultSize,
  })

  watchEffect(() => {
    ticket.minSize = minSize
    ticket.maxSize = maxSize
    ticket.collapsible = collapsible
    ticket.collapsedSize = collapsedSize
    ticket.defaultSize = defaultSize
  })

  onUnmounted(() => {
    splitter.panels.unregister(ticket.id)
  })

  const size = toRef(() => ticket.size)
  const isCollapsed = toRef(() => collapsible && !toValue(ticket.isSelected))

  function collapse () {
    splitter.collapse(ticket.index)
  }

  function expand () {
    splitter.expand(ticket.index)
  }

  defineExpose<SplitterPanelExpose>({ collapse, expand, size, isCollapsed })

  // Sync v-model:collapsed → internal state (post flush ensures siblings are registered)
  watch(collapsed, val => {
    if (val === undefined) return
    if (val && !isCollapsed.value) collapse()
    else if (!val && isCollapsed.value) expand()
  }, { immediate: true, flush: 'post' })

  // Sync internal state → v-model:collapsed
  watch(isCollapsed, val => {
    if (collapsed.value === undefined) return
    collapsed.value = val
  })

  watch(size, val => emit('resize', val))

  const slotProps = toRef((): SplitterPanelSlotProps => ({
    size: size.value,
    isCollapsed: isCollapsed.value,
    collapse,
    expand,
    attrs: {
      'id': panelId,
      'data-orientation': splitter.orientation.value,
      'data-panel-index': ticket.index,
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
