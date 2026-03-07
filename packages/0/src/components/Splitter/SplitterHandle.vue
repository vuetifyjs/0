/**
 * @module SplitterHandle
 *
 * @remarks
 * Draggable resize handle between two splitter panels. Implements the
 * WAI-ARIA window splitter pattern with pointer drag and keyboard support.
 */

<script lang="ts">
  // Components
  import { useSplitterRoot } from './SplitterRoot.vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { SplitterOrientation } from './SplitterRoot.vue'

  export interface SplitterHandleProps extends AtomProps {
    disabled?: boolean
    label?: string
  }

  export type SplitterHandleState = 'drag' | 'hover' | 'inactive'

  export interface SplitterHandleSlotProps {
    isDragging: boolean
    isDisabled: boolean
    state: SplitterHandleState
    attrs: {
      'role': 'separator'
      'tabindex': 0 | -1
      'aria-valuenow': number
      'aria-valuemin': number
      'aria-valuemax': number
      'aria-orientation': SplitterOrientation
      'aria-controls': string | undefined
      'aria-label': string | undefined
      'aria-disabled': true | undefined
      'data-state': SplitterHandleState
      'data-orientation': SplitterOrientation
      'data-disabled': true | undefined
      'onPointerdown': (e: PointerEvent) => void
      'onPointerenter': () => void
      'onPointerleave': () => void
      'onKeydown': (e: KeyboardEvent) => void
    }
  }
</script>

<script setup lang="ts">
  // Constants
  import { IN_BROWSER } from '#v0/constants/globals'

  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { useDocumentEventListener } from '#v0/composables/useEventListener'
  import { useToggleScope } from '#v0/composables/useToggleScope'

  // Utilities
  import { isNullOrUndefined } from '#v0/utilities'
  import { onScopeDispose, onUnmounted, shallowRef, toRef, toValue, useAttrs } from 'vue'

  defineOptions({ name: 'SplitterHandle', inheritAttrs: false })

  const attrs = useAttrs()

  defineSlots<{
    default: (props: SplitterHandleSlotProps) => any
  }>()

  const {
    as = 'div',
    renderless,
    disabled = false,
    label,
  } = defineProps<SplitterHandleProps>()

  const ARROW_STEP = 1
  const PAGE_STEP = 10

  const splitter = useSplitterRoot()
  const ticket = splitter.handles.register()
  const handleIndex = ticket.index

  onUnmounted(() => {
    splitter.handles.unregister(ticket.id)
  })

  const hovering = shallowRef(false)
  const startPosition = shallowRef(0)
  let rafId = 0
  let latestPos = 0

  const isDisabled = toRef(() => disabled || splitter.disabled.value)
  const isHorizontal = toRef(() => splitter.orientation.value === 'horizontal')

  const state = toRef((): SplitterHandleState => {
    if (splitter.draggingHandle.value === handleIndex) return 'drag'
    if (hovering.value) return 'hover'
    return 'inactive'
  })

  // aria-valuenow: size of the panel before this handle (0-100), rounded for AT
  const valuenow = toRef(() => Math.round(splitter.panel(handleIndex)?.size ?? 0))
  const valuemin = toRef(() => {
    const p = splitter.panel(handleIndex)
    if (!p) return 0
    return p.collapsible ? p.collapsedSize : p.minSize
  })
  const valuemax = toRef(() => {
    const p = splitter.panel(handleIndex)
    const adjacent = splitter.panel(handleIndex + 1)
    if (!p || !adjacent) return 100
    const adjMin = adjacent.collapsible ? adjacent.collapsedSize : adjacent.minSize
    return Math.min(p.maxSize, p.size + adjacent.size - adjMin)
  })

  function onPointerDown (e: PointerEvent) {
    if (isDisabled.value) return

    const target = e.target as Element
    target.setPointerCapture(e.pointerId)
    startPosition.value = isHorizontal.value ? e.clientX : e.clientY
    document.documentElement.style.cursor = isHorizontal.value ? 'col-resize' : 'row-resize'
    document.documentElement.style.userSelect = 'none'
    splitter.draggingHandle.value = handleIndex
  }

  useToggleScope(() => splitter.draggingHandle.value === handleIndex, () => {
    useDocumentEventListener('pointermove', (e: PointerEvent) => {
      latestPos = isHorizontal.value ? e.clientX : e.clientY
      if (rafId) return
      rafId = requestAnimationFrame(() => {
        const root = splitter.rootEl.value
        if (!root) return

        const rootSize = isHorizontal.value ? root.offsetWidth : root.offsetHeight
        if (!rootSize) return

        const delta = ((latestPos - startPosition.value) / rootSize) * 100
        startPosition.value = latestPos

        splitter.resize(handleIndex, delta)
        rafId = 0
      })
    })

    useDocumentEventListener('pointerup', () => {
      if (rafId) cancelAnimationFrame(rafId)
      rafId = 0
      if (IN_BROWSER) {
        document.documentElement.style.cursor = ''
        document.documentElement.style.userSelect = ''
      }
      splitter.draggingHandle.value = null
      splitter.onResizeEnd()
    })

    onScopeDispose(() => {
      if (rafId) cancelAnimationFrame(rafId)
      rafId = 0
      if (IN_BROWSER) {
        document.documentElement.style.cursor = ''
        document.documentElement.style.userSelect = ''
      }
    })
  })

  function onKeydown (e: KeyboardEvent) {
    if (isDisabled.value) return

    const forward = isHorizontal.value ? 'ArrowRight' : 'ArrowDown'
    const backward = isHorizontal.value ? 'ArrowLeft' : 'ArrowUp'

    switch (e.key) {
      case forward: {
        e.preventDefault()
        splitter.resize(handleIndex, ARROW_STEP)
        splitter.onResizeEnd()
        break
      }
      case backward: {
        e.preventDefault()
        splitter.resize(handleIndex, -ARROW_STEP)
        splitter.onResizeEnd()
        break
      }
      case 'PageDown': {
        e.preventDefault()
        splitter.resize(handleIndex, PAGE_STEP)
        splitter.onResizeEnd()
        break
      }
      case 'PageUp': {
        e.preventDefault()
        splitter.resize(handleIndex, -PAGE_STEP)
        splitter.onResizeEnd()
        break
      }
      case 'Home': {
        e.preventDefault()
        const p = splitter.panel(handleIndex)
        if (p?.collapsible) {
          splitter.collapse(handleIndex)
        } else {
          const current = p?.size ?? 0
          splitter.resize(handleIndex, valuemin.value - current)
        }
        splitter.onResizeEnd()
        break
      }
      case 'End': {
        e.preventDefault()
        const p = splitter.panel(handleIndex)
        if (p?.collapsible && !toValue(p.isSelected)) {
          splitter.expand(handleIndex)
        } else {
          const current = p?.size ?? 0
          splitter.resize(handleIndex, valuemax.value - current)
        }
        splitter.onResizeEnd()
        break
      }
    // No default
    }
  }

  function onPointerEnter () {
    hovering.value = true
  }

  function onPointerLeave () {
    hovering.value = false
  }

  // WAI-ARIA: separator orientation is perpendicular to the layout direction
  const ariaOrientation = toRef((): SplitterOrientation =>
    splitter.orientation.value === 'horizontal' ? 'vertical' : 'horizontal',
  )

  const ariaControls = toRef(() => {
    const p = splitter.panel(handleIndex)
    return isNullOrUndefined(p) ? undefined : String(p.id)
  })

  const slotProps = toRef((): SplitterHandleSlotProps => ({
    isDragging: splitter.draggingHandle.value === handleIndex,
    isDisabled: isDisabled.value,
    state: state.value,
    attrs: {
      'role': 'separator',
      'tabindex': isDisabled.value ? -1 : 0,
      'aria-valuenow': valuenow.value,
      'aria-valuemin': valuemin.value,
      'aria-valuemax': valuemax.value,
      'aria-orientation': ariaOrientation.value,
      'aria-controls': ariaControls.value,
      'aria-label': label || undefined,
      'aria-disabled': isDisabled.value || undefined,
      'data-state': state.value,
      'data-orientation': splitter.orientation.value,
      'data-disabled': isDisabled.value || undefined,
      'onPointerdown': onPointerDown,
      'onPointerenter': onPointerEnter,
      'onPointerleave': onPointerLeave,
      'onKeydown': onKeydown,
    },
  }))
</script>

<template>
  <Atom
    v-bind="{ ...attrs, ...slotProps.attrs }"
    :as
    :renderless
    :style="{ flexShrink: 0 }"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
