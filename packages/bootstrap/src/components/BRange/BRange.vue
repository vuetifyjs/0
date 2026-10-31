<script lang="ts">
  // Framework
  import { createSlider, isElement, isNaN, isString, isUndefined, useId } from '@vuetify/v0'

  // Utilities
  import { toRef, useAttrs, watch } from 'vue'

  export interface BRangeProps {
    /** Minimum value. Passed to `createSlider`. */
    min?: number
    /** Maximum value. Passed to `createSlider`. */
    max?: number
    /** Step. Passed to `createSlider`, which snaps the thumb. */
    step?: number
    disabled?: boolean
    /** Input id. Generated when omitted. */
    id?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BRange', inheritAttrs: false })

  defineEmits<{
    'update:model-value': [value: number]
  }>()

  const {
    min = 0,
    max = 100,
    step = 1,
    disabled = false,
    id,
  } = defineProps<BRangeProps>()

  const model = defineModel<number>()
  const attrs = useAttrs()
  const uid = useId()
  const fieldId = toRef(() => isString(id) && id.length > 0 ? id : uid)

  const slider = createSlider({
    min,
    max,
    step,
    disabled: () => disabled,
  })

  slider.register({ value: model.value ?? min })

  const current = toRef(() => slider.values.value[0] ?? min)

  const fill = toRef(() => {
    const span = slider.max - slider.min
    if (span === 0) return '0'
    return String((current.value - slider.min) / span)
  })

  function onModel (value: number | undefined) {
    if (isUndefined(value)) return
    if (slider.values.value[0] === value) return
    slider.set(0, value)
  }

  watch(() => model.value, onModel)

  function onInput (event: Event) {
    const target = event.target
    if (!isElement(target)) return
    const raw = Number((target as HTMLInputElement).value)
    if (isNaN(raw)) return
    slider.set(0, raw)
    const next = slider.values.value[0]
    if (isUndefined(next)) return
    model.value = next
  }
</script>

<template>
  <div class="form-range" v-bind="attrs">
    <input
      :id="fieldId"
      class="form-range-input"
      :disabled="disabled || undefined"
      :max="slider.max"
      :min="slider.min"
      :step="slider.step"
      :style="{ '--bs-range-fill': fill }"
      type="range"
      :value="current"
      @input="onInput"
    >
  </div>
</template>
