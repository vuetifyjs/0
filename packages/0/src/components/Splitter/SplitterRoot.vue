/**
 * @module SplitterRoot
 *
 * @remarks
 * Root component for splitter layouts. Provides context to child
 * SplitterPanel and SplitterHandle components. Manages panel sizes
 * and coordinates resize operations between adjacent panels.
 *
 * @todo v2: SplitterGrid / corner handle support — a cross-root coordinator
 * (possibly a `useLayout` plugin) that links horizontal and vertical roots,
 * enabling a single drag handle at the intersection to resize panels on both
 * axes simultaneously.
 */

<script lang="ts">
  // Foundational
  import { createContext } from '#v0/composables/createContext'

  // Utilities
  import { clamp } from '#v0/utilities'

  // Types
  import type { AtomExpose, AtomProps } from '#v0/components/Atom'
  import type { Ref } from 'vue'

  export type SplitterOrientation = 'horizontal' | 'vertical'

  export interface SplitterPanelState {
    minSize: number
    maxSize: number
    collapsible: boolean
    collapsedSize: number
    collapsed: boolean
    defaultSize: number
  }

  export interface SplitterContext {
    orientation: Ref<SplitterOrientation>
    disabled: Ref<boolean>
    sizes: Ref<number[]>
    panels: Ref<SplitterPanelState[]>
    panelIds: Ref<string[]>
    dragging: Ref<boolean>
    draggingHandle: Ref<number | null>
    rootEl: Ref<HTMLElement | null>
    register: (panel: SplitterPanelState, defaultSize: number, id: string) => number
    unregister: (index: number) => void
    registerHandle: () => number
    resize: (handleIndex: number, delta: number) => void
    onResizeEnd: () => void
    collapsePanel: (index: number) => void
    expandPanel: (index: number) => void
  }

  export interface SplitterRootProps extends AtomProps {
    orientation?: SplitterOrientation
    disabled?: boolean
  }

  export interface SplitterRootSlotProps {
    orientation: SplitterOrientation
    isDisabled: boolean
    sizes: number[]
    isDragging: boolean
    attrs: {
      'data-orientation': SplitterOrientation
      'data-dragging': true | undefined
    }
  }

  export const [useSplitterRoot, provideSplitterRoot] = createContext<SplitterContext>('v0:splitter')
</script>

<script setup lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Utilities
  import { ref, shallowRef, toRef, useAttrs, useTemplateRef } from 'vue'

  defineOptions({ name: 'SplitterRoot', inheritAttrs: false })

  const attrs = useAttrs()

  const emit = defineEmits<{
    layout: [sizes: number[]]
  }>()

  defineSlots<{
    default: (props: SplitterRootSlotProps) => any
  }>()

  const {
    as = 'div',
    renderless,
    orientation = 'horizontal',
    disabled = false,
  } = defineProps<SplitterRootProps>()

  const rootAtom = useTemplateRef<AtomExpose>('root')
  // Vue auto-unwraps exposed refs when accessed via template ref,
  // but TypeScript doesn't reflect this - cast corrects the type
  const rootEl = toRef(() => (rootAtom.value?.element as HTMLElement | null | undefined) ?? null)
  const sizes = ref<number[]>([])
  const panels = ref<SplitterPanelState[]>([])
  const panelIds = ref<string[]>([])
  const draggingHandle = shallowRef<number | null>(null)
  const dragging = toRef(() => draggingHandle.value !== null)

  let panelCount = 0
  let handleCount = 0

  function register (panel: SplitterPanelState, defaultSize: number, id: string) {
    const index = panelCount++
    panels.value.push(panel)
    sizes.value.push(defaultSize)
    panelIds.value.push(id)
    return index
  }

  function unregister (index: number) {
    panels.value.splice(index, 1)
    sizes.value.splice(index, 1)
    panelIds.value.splice(index, 1)
    panelCount--
  }

  function registerHandle () {
    return handleCount++
  }

  function effectiveMin (panel: SplitterPanelState) {
    return panel.collapsible && panel.collapsed ? panel.collapsedSize : panel.minSize
  }

  function resize (handleIndex: number, delta: number) {
    const before = handleIndex
    const after = handleIndex + 1

    if (before < 0 || after >= sizes.value.length) return

    const panel1 = panels.value[before]
    const panel2 = panels.value[after]
    const size1 = sizes.value[before]
    const size2 = sizes.value[after]

    if (!panel1 || !panel2 || size1 == null || size2 == null) return

    const total = size1 + size2

    // Compute bounds considering collapse state
    const min1 = effectiveMin(panel1)
    const min2 = effectiveMin(panel2)
    const lower = Math.max(min1, total - panel2.maxSize)
    const upper = Math.min(panel1.maxSize, total - min2)

    let newSize1 = clamp(size1 + delta, lower, upper)

    // Collapse snap: if dragging a collapsible panel below its minSize, snap to collapsedSize
    if (panel1.collapsible && !panel1.collapsed && newSize1 <= panel1.minSize && delta < 0) {
      newSize1 = panel1.collapsedSize
      panel1.collapsed = true
    } else if (panel1.collapsible && panel1.collapsed && newSize1 > panel1.collapsedSize) {
      // Expanding from collapsed: snap to minSize
      newSize1 = Math.max(newSize1, panel1.minSize)
      panel1.collapsed = false
    }

    if (panel2.collapsible && !panel2.collapsed && (total - newSize1) <= panel2.minSize && delta > 0) {
      newSize1 = total - panel2.collapsedSize
      panel2.collapsed = true
    } else if (panel2.collapsible && panel2.collapsed && (total - newSize1) > panel2.collapsedSize) {
      const newSize2 = total - newSize1
      if (newSize2 >= panel2.minSize) {
        panel2.collapsed = false
      } else {
        newSize1 = total - panel2.collapsedSize
      }
    }

    const newSize2 = total - newSize1

    sizes.value[before] = newSize1
    sizes.value[after] = newSize2
  }

  function collapsePanel (index: number) {
    const panel = panels.value[index]
    if (!panel || !panel.collapsible || panel.collapsed) return

    const neighbor = index > 0 ? index - 1 : index + 1
    if (sizes.value[neighbor] == null) return

    const oldSize = sizes.value[index] ?? panel.defaultSize
    const diff = oldSize - panel.collapsedSize

    sizes.value[neighbor] += diff
    sizes.value[index] = panel.collapsedSize
    panel.collapsed = true
  }

  function expandPanel (index: number) {
    const panel = panels.value[index]
    if (!panel || !panel.collapsible || !panel.collapsed) return

    const neighbor = index > 0 ? index - 1 : index + 1
    if (sizes.value[neighbor] == null) return

    const target = Math.min(panel.defaultSize, panel.maxSize)
    const diff = target - panel.collapsedSize
    const neighborPanel = panels.value[neighbor]
    const available = sizes.value[neighbor] - (neighborPanel?.minSize ?? 0)
    const take = Math.min(diff, available)

    sizes.value[neighbor] -= take
    sizes.value[index] = panel.collapsedSize + take
    panel.collapsed = false
  }

  function onResizeEnd () {
    emit('layout', [...sizes.value])
  }

  const context: SplitterContext = {
    orientation: toRef(() => orientation),
    disabled: toRef(() => disabled),
    sizes,
    panels,
    panelIds,
    dragging,
    draggingHandle,
    rootEl,
    register,
    unregister,
    registerHandle,
    resize,
    onResizeEnd,
    collapsePanel,
    expandPanel,
  }

  provideSplitterRoot(context)

  const slotProps = toRef((): SplitterRootSlotProps => ({
    orientation,
    isDisabled: disabled,
    sizes: sizes.value,
    isDragging: dragging.value,
    attrs: {
      'data-orientation': orientation,
      'data-dragging': dragging.value || undefined,
    },
  }))
</script>

<template>
  <Atom
    ref="root"
    v-bind="{ ...attrs, ...slotProps.attrs }"
    :as
    :renderless
    :style="{
      display: 'flex',
      flexDirection: orientation === 'horizontal' ? 'row' : 'column',
    }"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
