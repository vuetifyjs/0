/**
 * @module SliderThumb
 *
 * @remarks
 * Draggable thumb control for sliders. Auto-registers with parent
 * Slider.Root to get its index. Handles pointer drag and keyboard
 * navigation. Provides full ARIA slider attributes.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'
  import { useSliderRoot } from './SliderRoot.vue'

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
      'aria-label': string | undefined
      'aria-labelledby': string | undefined
      'data-state': SliderThumbState
      'data-disabled': true | undefined
      'style': Record<string, string>
    }
  }
</script>

<script setup lang="ts">
  // Utilities
  import { onUnmounted, toRef, toValue, useAttrs } from 'vue'

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

  const index = root.registerThumb()

  onUnmounted(() => {
    root.unregisterThumb(index)
  })

  const value = toRef(() => root.values.value[index] ?? root.min)
  const pct = toRef(() => root.percent(value.value))
  const isDragging = toRef(() => root.dragging.value === index)
  const isDisabled = toRef(() => toValue(root.disabled))
  const isVertical = toRef(() => toValue(root.orientation) === 'vertical')

  function onKeydown (e: KeyboardEvent) {
    if (isDisabled.value) return

    const isInverted = toValue(root.inverted)

    const actions: Record<string, () => void> = {
      ArrowRight: () => isInverted ? root.stepDown(index) : root.stepUp(index),
      ArrowUp: () => root.stepUp(index),
      ArrowLeft: () => isInverted ? root.stepUp(index) : root.stepDown(index),
      ArrowDown: () => root.stepDown(index),
      PageUp: () => root.stepUp(index, 10),
      PageDown: () => root.stepDown(index, 10),
      Home: () => root.setToMin(index),
      End: () => root.setToMax(index),
    }

    // Shift + Arrow = 10x step
    if (e.shiftKey && e.key.startsWith('Arrow')) {
      e.preventDefault()
      const base = e.key === 'ArrowRight' || e.key === 'ArrowUp' ? 'stepUp' : 'stepDown'
      const method = (e.key === 'ArrowRight' || e.key === 'ArrowLeft') && isInverted
        ? (base === 'stepUp' ? 'stepDown' : 'stepUp')
        : base
      root[method](index, 10)
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
    index,
    value: value.value,
    percent: pct.value,
    isDragging: isDragging.value,
    attrs: {
      'role': 'slider',
      'tabindex': isDisabled.value ? -1 : 0,
      'aria-valuenow': value.value,
      'aria-valuemin': root.min,
      'aria-valuemax': root.max,
      'aria-valuetext': ariaValuetext || undefined,
      'aria-orientation': toValue(root.orientation),
      'aria-disabled': isDisabled.value ? true : undefined,
      'aria-label': ariaLabel || undefined,
      'aria-labelledby': ariaLabelledby || undefined,
      'data-state': dataState.value,
      'data-disabled': isDisabled.value ? true : undefined,
      'style': {
        [isVertical.value ? 'bottom' : 'left']: `${pct.value}%`,
        '--v0-slider-thumb-percent': `${pct.value}%`,
      },
    },
  }))
</script>

<template>
  <Atom
    v-bind="{ ...attrs, ...slotProps.attrs }"
    :as
    :renderless
    @keydown="onKeydown"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
