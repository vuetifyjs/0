/**
 * @module SplitterRoot
 *
 * @remarks
 * Root component for splitter layouts. Provides context to child
 * SplitterPanel and SplitterHandle components. Manages panel sizes
 * and coordinates resize operations between adjacent panels.
 */

<script lang="ts">
  // Foundational
  import { createContext } from '#v0/composables/createContext'

  // Utilities
  import { clamp } from '#v0/utilities'

  // Types
  import type { Ref } from 'vue'

  export type SplitterOrientation = 'horizontal' | 'vertical'

  export interface SplitterPanelState {
    minSize: number
    maxSize: number
  }

  export interface SplitterContext {
    orientation: Ref<SplitterOrientation>
    disabled: Ref<boolean>
    sizes: Ref<number[]>
    dragging: Ref<boolean>
    rootEl: Ref<HTMLElement | null>
    register: (panel: SplitterPanelState, defaultSize: number) => number
    unregister: (index: number) => void
    registerHandle: () => number
    resize: (handleIndex: number, delta: number) => void
  }

  export interface SplitterRootProps {
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
  // Utilities
  import { ref, toRef, useTemplateRef } from 'vue'

  defineOptions({ name: 'SplitterRoot' })

  defineSlots<{
    default: (props: SplitterRootSlotProps) => any
  }>()

  const {
    orientation = 'horizontal',
    disabled = false,
  } = defineProps<SplitterRootProps>()

  const rootEl = useTemplateRef<HTMLElement>('root')
  const sizes = ref<number[]>([])
  const panels = ref<SplitterPanelState[]>([])
  const dragging = ref(false)

  let panelCount = 0
  let handleCount = 0

  function register (panel: SplitterPanelState, defaultSize: number) {
    const index = panelCount++
    panels.value.push(panel)
    sizes.value.push(defaultSize)
    return index
  }

  function unregister (index: number) {
    panels.value.splice(index, 1)
    sizes.value.splice(index, 1)
    panelCount--
  }

  function registerHandle () {
    return handleCount++
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

    const newSize1 = clamp(size1 + delta, panel1.minSize, Math.min(panel1.maxSize, total - panel2.minSize))
    const newSize2 = total - newSize1

    if (newSize2 < panel2.minSize || newSize2 > panel2.maxSize) return

    sizes.value[before] = newSize1
    sizes.value[after] = newSize2
  }

  const context: SplitterContext = {
    orientation: toRef(() => orientation),
    disabled: toRef(() => disabled),
    sizes,
    dragging,
    rootEl,
    register,
    unregister,
    registerHandle,
    resize,
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
  <div
    ref="root"
    :style="{
      display: 'flex',
      flexDirection: orientation === 'horizontal' ? 'row' : 'column',
    }"
    v-bind="slotProps.attrs"
  >
    <slot v-bind="slotProps" />
  </div>
</template>
