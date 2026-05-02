/**
 * @module SplitterPanel
 *
 * @see https://0.vuetifyjs.com/components/semantic/splitter
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

  // Composables
  import { useResizeObserver } from '#v0/composables/useResizeObserver'

  // Utilities
  import { isString, isUndefined, useId } from '#v0/utilities'
  import { mergeProps, onBeforeUnmount, shallowRef, toRef, toValue, useAttrs, watch, watchEffect } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { SplitterOrientation } from './SplitterRoot.vue'
  import type { Ref } from 'vue'

  export type SplitterPanelSize = number | string

  export interface SplitterPanelProps extends AtomProps {
    defaultSize: SplitterPanelSize
    minSize?: SplitterPanelSize
    maxSize?: SplitterPanelSize
    collapsible?: boolean
    collapsedSize?: SplitterPanelSize
  }

  export interface SplitterPanelExpose {
    collapse: () => void
    expand: () => void
    size: Readonly<Ref<number>>
    isCollapsed: Readonly<Ref<boolean>>
  }

  export interface SplitterPanelSlotProps {
    size: number
    isCollapsed: boolean
    collapse: () => void
    expand: () => void
    attrs: {
      'id': string
      'style'?: Record<string, string>
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
    maxSize: maxSizeProp = 100,
    collapsible = false,
    collapsedSize = 0,
  } = defineProps<SplitterPanelProps>()

  const splitter = useSplitterRoot()
  const panelId = useId()
  const rootSize = shallowRef(0)

  function isPx (value: SplitterPanelSize): boolean {
    return isString(value) && value.endsWith('px')
  }

  if (isPx(defaultSize) || isPx(minSize) || isPx(maxSizeProp) || isPx(collapsedSize)) {
    useResizeObserver(splitter.rootEl, entries => {
      const rect = entries[0]?.contentRect
      rootSize.value = splitter.orientation.value === 'horizontal'
        ? rect?.width ?? 0
        : rect?.height ?? 0
    })
  }

  function percent (value: SplitterPanelSize, fallback: number): number {
    if (!isString(value)) return value

    const num = Number.parseFloat(value)
    if (Number.isNaN(num)) return fallback

    if (value.endsWith('px')) {
      const dimension = rootSize.value
        || (splitter.orientation.value === 'horizontal'
          ? splitter.rootEl.value?.offsetWidth
          : splitter.rootEl.value?.offsetHeight)
        || 0

      return dimension > 0 ? (num / dimension) * 100 : fallback
    }

    return num
  }

  const ticket = splitter.panels.register({
    id: panelId,
    size: percent(defaultSize, 0),
    minSize: percent(minSize, 0),
    maxSize: percent(maxSizeProp, 100),
    collapsible,
    collapsedSize: percent(collapsedSize, 0),
    defaultSize: percent(defaultSize, 0),
  })

  watchEffect(() => {
    ticket.minSize = percent(minSize, 0)
    ticket.maxSize = percent(maxSizeProp, 100)
    ticket.collapsible = collapsible
    ticket.collapsedSize = percent(collapsedSize, 0)
    ticket.defaultSize = percent(defaultSize, 0)
  })

  onBeforeUnmount(() => {
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
    if (isUndefined(val)) return
    if (val && !isCollapsed.value) collapse()
    else if (!val && isCollapsed.value) expand()
  }, { immediate: true, flush: 'post' })

  // Sync internal state → v-model:collapsed
  watch(isCollapsed, val => {
    if (isUndefined(collapsed.value)) return
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
    v-bind="mergeProps(attrs, slotProps.attrs)"
    :as
    :renderless
    :style="[attrs.style, slotProps.attrs.style, {
      flexGrow: 0,
      flexShrink: 0,
      flexBasis: `${size}%`,
      minWidth: 0,
      minHeight: 0,
    }]"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
