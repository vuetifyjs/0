/**
 * @module SliderRoot
 *
 * @see https://0.vuetifyjs.com/components/forms/slider
 *
 * @remarks
 * Root component for sliders. Creates slider context, provides it to
 * child components (Track, Range, Thumb, HiddenInput), and bridges v-model.
 *
 * Value is `number` for single thumbs or `number[]` for range sliders.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import SliderHiddenInput from './SliderHiddenInput.vue'

  // Composables
  import { createContext } from '#v0/composables/createContext'
  import { createSlider } from '#v0/composables/createSlider'
  import { useDocumentEventListener } from '#v0/composables/useEventListener'
  import { useProxyModel } from '#v0/composables/useProxyModel'
  import { useToggleScope } from '#v0/composables/useToggleScope'

  // Constants
  import { IN_BROWSER } from '#v0/constants/globals'

  // Utilities
  import { isArray, isNull, isUndefined, useId } from '#v0/utilities'
  import { computed, mergeProps, shallowRef, toRef, toValue, useAttrs } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { SliderContext } from '#v0/composables/createSlider'
  import type { MaybeRefOrGetter, Ref } from 'vue'

  export interface SliderRootContext extends SliderContext {
    /** Unique identifier */
    readonly id: string
    /** Form field name */
    readonly name?: string
    /** Form association */
    readonly form?: string
    /** Track which thumb is currently being dragged */
    dragging: Ref<number | null>
    /** Track element ref for percent calculation */
    track: Ref<HTMLElement | null>
    /** Start a drag interaction for a thumb */
    onDrag: (index: number, event: PointerEvent, thumbEl?: HTMLElement) => void
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
    disabled?: MaybeRefOrGetter<boolean>
    /** Readonly — focusable but not editable */
    readonly?: MaybeRefOrGetter<boolean>
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
    /** Whether the slider is readonly */
    isReadonly: boolean
    /** Slider orientation */
    orientation: 'horizontal' | 'vertical'
    /** Round a value to the nearest step, clamped to min/max */
    snap: (value: number) => number
    /** Convert a value to a 0–100 percentage */
    fromValue: (value: number) => number
    /** Convert a 0–100 percentage to a snapped value */
    fromPercent: (percent: number) => number
    /** Set the value at a thumb index */
    set: (index: number, value: number) => void
    /** Increment a thumb's value by step × multiplier */
    up: (index: number, multiplier?: number) => void
    /** Decrement a thumb's value by step × multiplier */
    down: (index: number, multiplier?: number) => void
    /** Set a thumb to the minimum value */
    floor: (index: number) => void
    /** Set a thumb to the maximum value */
    ceil: (index: number) => void
    /** Pre-computed attributes for binding */
    attrs: {
      'data-disabled': true | undefined
      'data-readonly': true | undefined
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

  const emit = defineEmits<{
    'update:model-value': [value: number | number[]]
    'start': [value: number | number[]]
    'end': [value: number | number[]]
  }>()

  const {
    as = 'div',
    renderless,
    id = useId(),
    min = 0,
    max = 100,
    step = 1,
    disabled = false,
    readonly: readonlyProp = false,
    orientation = 'horizontal',
    inverted = false,
    minStepsBetweenThumbs = 0,
    crossover = false,
    name,
    form,
    namespace = 'v0:slider:root',
  } = defineProps<SliderRootProps>()

  const model = defineModel<number | number[]>({ default: () => [] })
  const scalar = !isArray(model.value) && !isUndefined(model.value)

  const internal = computed({
    get: () => isArray(model.value) ? model.value : [model.value],
    set: (arr: number[]) => {
      model.value = scalar ? (arr[0] ?? 0) : arr
    },
  })

  const slider = createSlider({
    min,
    max,
    step,
    disabled,
    readonly: readonlyProp,
    orientation,
    inverted,
    minStepsBetweenThumbs,
    crossover,
  })

  useProxyModel(slider, internal, { multiple: true })

  const dragging = shallowRef<number | null>(null)
  const track = shallowRef<HTMLElement | null>(null)

  const dragOffset = shallowRef(0)

  function getPercent (e: PointerEvent): number {
    const el = track.value
    if (!el) return 0
    const rect = el.getBoundingClientRect()
    const isVertical = toValue(slider.orientation) === 'vertical'

    return isVertical
      ? ((rect.bottom - e.clientY - dragOffset.value) / rect.height) * 100
      : ((e.clientX - rect.left - dragOffset.value) / rect.width) * 100
  }

  useToggleScope(
    () => !isNull(dragging.value),
    () => {
      if (IN_BROWSER) {
        document.documentElement.style.touchAction = 'none'
      }

      useDocumentEventListener('pointermove', (e: PointerEvent) => {
        if (isNull(dragging.value)) return
        const percent = getPercent(e)
        slider.set(dragging.value, slider.fromPercent(percent))
      })

      useDocumentEventListener('pointerup', () => {
        if (IN_BROWSER) {
          document.documentElement.style.touchAction = ''
        }
        const values = [...slider.values.value]
        emit('end', scalar ? values[0] ?? 0 : values)
        dragging.value = null
        dragOffset.value = 0
      })
    },
  )

  function onDrag (index: number, event: PointerEvent, thumbEl?: HTMLElement): void {
    if (toValue(disabled)) return
    if (toValue(readonlyProp)) return
    if (event.button !== 0) return
    event.preventDefault()

    if (thumbEl) {
      const rect = thumbEl.getBoundingClientRect()
      const isVertical = toValue(slider.orientation) === 'vertical'
      dragOffset.value = isVertical
        ? event.clientY - (rect.top + rect.height / 2)
        : event.clientX - (rect.left + rect.width / 2)
    } else {
      dragOffset.value = 0
    }

    dragging.value = index
    const values = [...slider.values.value]
    emit('start', scalar ? values[0] ?? 0 : values)
  }

  const context: SliderRootContext = {
    ...slider,
    id,
    name,
    form,
    dragging,
    track,
    onDrag,
  }

  provideSliderRoot(namespace, context)

  const isDisabled = toRef(() => toValue(disabled))
  const isReadonly = toRef(() => toValue(readonlyProp))

  const slotProps = toRef((): SliderRootSlotProps => ({
    id,
    values: slider.values.value,
    min,
    max,
    isDisabled: isDisabled.value,
    isReadonly: isReadonly.value,
    orientation: toValue(slider.orientation),
    snap: slider.snap,
    fromValue: slider.fromValue,
    fromPercent: slider.fromPercent,
    set: slider.set,
    up: slider.up,
    down: slider.down,
    floor: slider.floor,
    ceil: slider.ceil,
    attrs: {
      'data-disabled': isDisabled.value ? true : undefined,
      'data-readonly': isReadonly.value ? true : undefined,
      'data-orientation': toValue(slider.orientation),
    },
  }))
</script>

<template>
  <Atom
    v-bind="mergeProps(attrs, slotProps.attrs)"
    :as
    :renderless
  >
    <slot v-bind="slotProps" />
  </Atom>

  <template v-if="name">
    <SliderHiddenInput
      v-for="(_, index) in slider.values.value"
      :key="index"
      :index
    />
  </template>
</template>
