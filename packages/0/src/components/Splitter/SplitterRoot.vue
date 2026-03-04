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
  import type { AtomExpose, AtomProps } from '#v0/components/Atom'
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
    panels: Ref<SplitterPanelState[]>
    panelIds: Ref<string[]>
    dragging: Ref<boolean>
    draggingHandle: Ref<number | null>
    rootEl: Ref<HTMLElement | null>
    register: (panel: SplitterPanelState, defaultSize: number, id: string) => number
    unregister: (index: number) => void
    registerHandle: () => number
    resize: (handleIndex: number, delta: number) => void
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

    const lower = Math.max(panel1.minSize, total - panel2.maxSize)
    const upper = Math.min(panel1.maxSize, total - panel2.minSize)
    const newSize1 = clamp(size1 + delta, lower, upper)
    const newSize2 = total - newSize1

    sizes.value[before] = newSize1
    sizes.value[after] = newSize2
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
