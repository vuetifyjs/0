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

  export interface SplitterHandleProps extends AtomProps {
    disabled?: boolean
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
      'aria-orientation': string
      'aria-disabled': boolean | undefined
      'data-state': SplitterHandleState
      'data-orientation': string
      'data-disabled': true | undefined
      'onPointerdown': (e: PointerEvent) => void
      'onPointerenter': () => void
      'onPointerleave': () => void
      'onKeydown': (e: KeyboardEvent) => void
    }
  }
</script>

<script setup lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { useDocumentEventListener } from '#v0/composables/useEventListener'
  import { useToggleScope } from '#v0/composables/useToggleScope'

  // Utilities
  import { shallowRef, toRef, toValue, useAttrs } from 'vue'

  defineOptions({ name: 'SplitterHandle', inheritAttrs: false })

  const attrs = useAttrs()

  defineSlots<{
    default: (props: SplitterHandleSlotProps) => any
  }>()

  const {
    as = 'div',
    renderless,
    disabled = false,
  } = defineProps<SplitterHandleProps>()

  const KEYBOARD_STEP = 10

  const splitter = useSplitterRoot()
  const handleIndex = splitter.registerHandle()

  const hovering = shallowRef(false)
  const startPosition = shallowRef(0)
  let rafId = 0
  let latestPos = 0

  const isDisabled = toRef(() => disabled || toValue(splitter.disabled))
  const isHorizontal = toRef(() => splitter.orientation.value === 'horizontal')

  const state = toRef((): SplitterHandleState => {
    if (splitter.dragging.value) return 'drag'
    if (hovering.value) return 'hover'
    return 'inactive'
  })

  // aria-valuenow: size of the panel before this handle (0-100)
  const valuenow = toRef(() => splitter.sizes.value[handleIndex] ?? 0)
  const valuemin = toRef(() => 0)
  const valuemax = toRef(() => {
    const before = splitter.sizes.value[handleIndex] ?? 0
    const after = splitter.sizes.value[handleIndex + 1] ?? 0
    return before + after
  })

  function onPointerDown (e: PointerEvent) {
    if (isDisabled.value) return

    const target = e.target as Element
    target.setPointerCapture(e.pointerId)
    startPosition.value = isHorizontal.value ? e.clientX : e.clientY
    document.documentElement.style.cursor = isHorizontal.value ? 'col-resize' : 'row-resize'
    splitter.dragging.value = true
  }

  useToggleScope(() => splitter.dragging.value, () => {
    useDocumentEventListener('pointermove', (e: PointerEvent) => {
      latestPos = isHorizontal.value ? e.clientX : e.clientY
      if (rafId) return
      rafId = requestAnimationFrame(() => {
        const root = splitter.rootEl.value
        if (!root) return

        const rootSize = isHorizontal.value ? root.offsetWidth : root.offsetHeight
        const delta = ((latestPos - startPosition.value) / rootSize) * 100
        startPosition.value = latestPos

        splitter.resize(handleIndex, delta)
        rafId = 0
      })
    })

    useDocumentEventListener('pointerup', () => {
      if (rafId) cancelAnimationFrame(rafId)
      rafId = 0
      document.documentElement.style.cursor = ''
      splitter.dragging.value = false
    })
  })

  function onKeydown (e: KeyboardEvent) {
    if (isDisabled.value) return

    const forward = isHorizontal.value ? 'ArrowRight' : 'ArrowDown'
    const backward = isHorizontal.value ? 'ArrowLeft' : 'ArrowUp'

    switch (e.key) {
      case forward: {
        e.preventDefault()
        splitter.resize(handleIndex, KEYBOARD_STEP)

        break
      }
      case backward: {
        e.preventDefault()
        splitter.resize(handleIndex, -KEYBOARD_STEP)

        break
      }
      case 'Home': {
        e.preventDefault()
        splitter.resize(handleIndex, -100)

        break
      }
      case 'End': {
        e.preventDefault()
        splitter.resize(handleIndex, 100)

        break
      }
    // No default
    }
  }

  const slotProps = toRef((): SplitterHandleSlotProps => ({
    isDragging: splitter.dragging.value,
    isDisabled: isDisabled.value,
    state: state.value,
    attrs: {
      'role': 'separator',
      'tabindex': isDisabled.value ? -1 : 0,
      'aria-valuenow': valuenow.value,
      'aria-valuemin': valuemin.value,
      'aria-valuemax': valuemax.value,
      'aria-orientation': splitter.orientation.value,
      'aria-disabled': isDisabled.value || undefined,
      'data-state': state.value,
      'data-orientation': splitter.orientation.value,
      'data-disabled': isDisabled.value || undefined,
      'onPointerdown': onPointerDown,
      'onPointerenter': () => {
        hovering.value = true
      },
      'onPointerleave': () => {
        hovering.value = false
      },
      'onKeydown': onKeydown,
    },
  }))
</script>

<template>
  <Atom
    v-bind="{ ...attrs, ...slotProps.attrs }"
    :as
    :renderless
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
