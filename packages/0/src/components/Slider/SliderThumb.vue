/**
 * @module SliderThumb
 *
 * @see https://0.vuetifyjs.com/components/forms/slider
 *
 * @remarks
 * Draggable thumb control for sliders. Auto-registers with parent
 * Slider.Root to get its index. Handles pointer drag and keyboard
 * navigation. Provides full ARIA slider attributes.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useSliderRoot } from './SliderRoot.vue'

  // Utilities
  import { isUndefined } from '#v0/utilities'
  import { mergeProps, onBeforeUnmount, toRef, toValue, useAttrs, useTemplateRef } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export type SliderThumbState = 'dragging' | 'idle'

  export interface SliderThumbProps extends AtomProps {
    /** Namespace for connecting to parent Slider.Root */
    namespace?: string
    /** Accessible label for this thumb */
    ariaLabel?: string
    /** ID of element labelling this thumb */
    ariaLabelledby?: string
    /** Custom aria-valuetext (for formatted display) */
    ariaValuetext?: string
  }

  export interface SliderThumbSlotProps {
    /** Thumb index in parent slider */
    index: number
    /** Current value of this thumb */
    value: number
    /** Current value as percentage (0-100) */
    percent: number
    /** Whether this thumb is being dragged */
    isDragging: boolean
    /** Pre-computed ARIA and data attributes */
    attrs: {
      'role': 'slider'
      'tabindex': 0 | -1
      'aria-valuenow': number
      'aria-valuemin': number
      'aria-valuemax': number
      'aria-valuetext': string | undefined
      'aria-orientation': 'horizontal' | 'vertical'
      'aria-disabled': true | undefined
      'aria-readonly': true | undefined
      'aria-label': string | undefined
      'aria-labelledby': string | undefined
      'data-state': SliderThumbState
      'data-disabled': true | undefined
      'data-readonly': true | undefined
      'style': Record<string, string>
      'onKeydown': (e: KeyboardEvent) => void
      'onPointerdown': (e: PointerEvent) => void
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'SliderThumb', inheritAttrs: false })

  const attrs = useAttrs()

  defineSlots<{
    default: (props: SliderThumbSlotProps) => any
  }>()

  const {
    as = 'span',
    renderless,
    namespace = 'v0:slider:root',
    ariaLabel,
    ariaLabelledby,
    ariaValuetext,
  } = defineProps<SliderThumbProps>()

  const root = useSliderRoot(namespace)
  const thumbRef = useTemplateRef<{ element: HTMLElement | null }>('thumb')

  const ticket = root.register()

  onBeforeUnmount(() => {
    root.unregister(ticket.id)
  })

  const index = toRef(() => ticket.index)
  const value = toRef(() => toValue(ticket.value))
  const pct = toRef(() => root.fromValue(value.value))
  const isDragging = toRef(() => root.dragging.value === index.value)
  const isDisabled = toRef(() => toValue(root.disabled))
  const isReadonly = toRef(() => toValue(root.readonly))
  const isVertical = toRef(() => toValue(root.orientation) === 'vertical')

  // Per-thumb constrained range for ARIA (WAI-ARIA multi-thumb slider pattern)
  const valueMin = toRef(() => {
    if (root.crossover) return root.min
    const prev = root.values.value[index.value - 1]
    return isUndefined(prev) ? root.min : prev
  })
  const valueMax = toRef(() => {
    if (root.crossover) return root.max
    const next = root.values.value[index.value + 1]
    return isUndefined(next) ? root.max : next
  })

  function onPointerdown (e: PointerEvent) {
    root.onDrag(index.value, e, thumbRef.value?.element ?? undefined)
  }

  function onKeydown (e: KeyboardEvent) {
    if (isDisabled.value || isReadonly.value) return

    const isInverted = toValue(root.inverted)

    const actions: Record<string, () => void> = {
      ArrowRight: () => isInverted ? root.down(index.value) : root.up(index.value),
      ArrowUp: () => root.up(index.value),
      ArrowLeft: () => isInverted ? root.up(index.value) : root.down(index.value),
      ArrowDown: () => root.down(index.value),
      PageUp: () => root.up(index.value, 10),
      PageDown: () => root.down(index.value, 10),
      Home: () => root.floor(index.value),
      End: () => root.ceil(index.value),
    }

    // Shift + Arrow = 10x step
    if (e.shiftKey && e.key.startsWith('Arrow')) {
      e.preventDefault()
      const base = e.key === 'ArrowRight' || e.key === 'ArrowUp' ? 'up' : 'down'
      const method = (e.key === 'ArrowRight' || e.key === 'ArrowLeft') && isInverted
        ? (base === 'up' ? 'down' : 'up')
        : base
      root[method](index.value, 10)
      return
    }

    const action = actions[e.key]
    if (!action) return

    e.preventDefault()
    action()
  }

  const dataState = toRef((): SliderThumbState =>
    isDragging.value ? 'dragging' : 'idle',
  )

  const slotProps = toRef((): SliderThumbSlotProps => ({
    index: index.value,
    value: value.value,
    percent: pct.value,
    isDragging: isDragging.value,
    attrs: {
      'role': 'slider',
      'tabindex': isDisabled.value ? -1 : 0,
      'aria-valuenow': value.value,
      'aria-valuemin': valueMin.value,
      'aria-valuemax': valueMax.value,
      'aria-valuetext': ariaValuetext || undefined,
      'aria-orientation': toValue(root.orientation),
      'aria-disabled': isDisabled.value ? true : undefined,
      'aria-readonly': isReadonly.value ? true : undefined,
      'aria-label': ariaLabel || undefined,
      'aria-labelledby': ariaLabelledby || undefined,
      'data-state': dataState.value,
      'data-disabled': isDisabled.value ? true : undefined,
      'data-readonly': isReadonly.value ? true : undefined,
      'style': {
        [isVertical.value ? 'bottom' : 'left']: `${pct.value}%`,
        'touch-action': 'none',
      },
      'onKeydown': onKeydown,
      'onPointerdown': onPointerdown,
    },
  }))
</script>

<template>
  <Atom
    ref="thumb"
    v-bind="mergeProps(attrs, slotProps.attrs)"
    :as
    :renderless
    :style="[attrs.style, slotProps.attrs.style]"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
