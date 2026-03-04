/**
 * @module SliderRoot
 *
 * @remarks
 * Root component for sliders. Creates slider context, provides it to
 * child components (Track, Range, Thumb, HiddenInput), and bridges v-model.
 *
 * Value is always `number[]`: single thumb = `[50]`, range = `[25, 75]`.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'
  import SliderHiddenInput from './SliderHiddenInput.vue'

  // Foundational
  import { createContext } from '#v0/composables/createContext'

  // Composables
  import { createSlider } from '#v0/composables/createSlider'
  import { useDocumentEventListener } from '#v0/composables/useEventListener'
  import { useToggleScope } from '#v0/composables/useToggleScope'

  // Utilities
  import { shallowRef, toRef, toValue, useAttrs, useId, watch } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { SliderContext } from '#v0/composables/createSlider'
  import type { MaybeRef, Ref } from 'vue'

  export interface SliderRootContext extends SliderContext {
    /** Unique identifier */
    readonly id: string
    /** Form field name */
    readonly name?: string
    /** Form association */
    readonly form?: string
    /** Register a thumb, returns its index */
    registerThumb: () => number
    /** Unregister a thumb by index */
    unregisterThumb: (index: number) => void
    /** Track which thumb is currently being dragged */
    dragging: Ref<number | null>
    /** Track element ref for percent calculation */
    trackElement: Ref<HTMLElement | null>
    /** Start a drag interaction for a thumb */
    startDrag: (index: number, event: PointerEvent) => void
  }

  export interface SliderRootProps extends AtomProps {
    /** Unique identifier (auto-generated if not provided) */
    id?: string
    /** Minimum value (default: 0) */
    min?: number
    /** Maximum value (default: 100) */
    max?: number
    /** Step increment (default: 1) */
    step?: number
    /** Disables the slider */
    disabled?: MaybeRef<boolean>
    /** Slider orientation */
    orientation?: 'horizontal' | 'vertical'
    /** Flip the percent axis */
    inverted?: boolean
    /** Minimum steps between adjacent thumbs (default: 0) */
    minStepsBetweenThumbs?: number
    /** Allow thumbs to pass through each other (default: false) */
    crossover?: boolean
    /** Form field name — triggers hidden inputs */
    name?: string
    /** Associate with form by ID */
    form?: string
    /** Namespace for context provision */
    namespace?: string
  }

  export interface SliderRootSlotProps {
    /** Unique identifier */
    id: string
    /** All current values */
    values: number[]
    /** Minimum value */
    min: number
    /** Maximum value */
    max: number
    /** Whether the slider is disabled */
    isDisabled: boolean
    /** Slider orientation */
    orientation: 'horizontal' | 'vertical'
    /** Pre-computed attributes for binding */
    attrs: {
      'data-disabled': true | undefined
      'data-orientation': 'horizontal' | 'vertical'
    }
  }

  export const [useSliderRoot, provideSliderRoot] = createContext<SliderRootContext>()
</script>

<script setup lang="ts">
  defineOptions({ name: 'SliderRoot', inheritAttrs: false })

  const attrs = useAttrs()

  defineSlots<{
    default: (props: SliderRootSlotProps) => any
  }>()

  defineEmits<{
    'update:model-value': [value: number[]]
    'valueCommit': [value: number[]]
  }>()

  const {
    as = 'div',
    renderless,
    id = useId(),
    min = 0,
    max = 100,
    step = 1,
    disabled = false,
    orientation = 'horizontal',
    inverted = false,
    minStepsBetweenThumbs = 0,
    crossover = false,
    name,
    form,
    namespace = 'v0:slider:root',
  } = defineProps<SliderRootProps>()

  const model = defineModel<number[]>({ default: () => [] })

  const slider = createSlider({
    min,
    max,
    step,
    disabled,
    orientation,
    inverted,
    minStepsBetweenThumbs,
    crossover,
  })

  function arraysEqual (a: number[], b: number[]): boolean {
    if (a.length !== b.length) return false
    for (const [index, element] of a.entries()) {
      if (element !== b[index]) return false
    }
    return true
  }

  // Sync model → slider values
  watch(model, v => {
    if (!arraysEqual(slider.values.value, v)) {
      slider.values.value = [...v]
    }
  }, { immediate: true })

  // Sync slider values → model
  watch(slider.values, v => {
    if (!arraysEqual(model.value, v)) {
      model.value = [...v]
    }
  })

  // Thumb registration with index recycling (lowest-first)
  const active = new Set<number>()
  function registerThumb (): number {
    let index = 0
    while (active.has(index)) index++
    active.add(index)
    return index
  }
  function unregisterThumb (index: number): void {
    active.delete(index)
  }

  const dragging = shallowRef<number | null>(null)
  const trackElement = shallowRef<HTMLElement | null>(null)

  function getPercent (e: PointerEvent): number {
    const el = trackElement.value
    if (!el) return 0
    const rect = el.getBoundingClientRect()
    const isVertical = toValue(slider.orientation) === 'vertical'

    if (isVertical) {
      return ((rect.bottom - e.clientY) / rect.height) * 100
    }
    return ((e.clientX - rect.left) / rect.width) * 100
  }

  useToggleScope(
    () => dragging.value !== null,
    () => {
      useDocumentEventListener('pointermove', (e: PointerEvent) => {
        if (dragging.value === null) return
        const percent = getPercent(e)
        slider.setValue(dragging.value, slider.fromPercent(percent))
      })

      useDocumentEventListener('pointerup', () => {
        dragging.value = null
      })
    },
  )

  function startDrag (index: number, event: PointerEvent): void {
    if (toValue(disabled)) return
    if (event.button !== 0) return
    event.preventDefault()
    dragging.value = index
  }

  const context: SliderRootContext = {
    ...slider,
    id,
    name,
    form,
    registerThumb,
    unregisterThumb,
    dragging,
    trackElement,
    startDrag,
  }

  provideSliderRoot(namespace, context)

  const isDisabled = toRef(() => toValue(disabled))

  const slotProps = toRef((): SliderRootSlotProps => ({
    id,
    values: slider.values.value,
    min,
    max,
    isDisabled: isDisabled.value,
    orientation: toValue(slider.orientation),
    attrs: {
      'data-disabled': isDisabled.value ? true : undefined,
      'data-orientation': toValue(slider.orientation),
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

  <template v-if="name">
    <SliderHiddenInput
      v-for="(_, index) in slider.values.value"
      :key="index"
      :index="index"
    />
  </template>
</template>
