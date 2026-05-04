/**
 * @module SliderHiddenInput
 *
 * @see https://0.vuetifyjs.com/components/forms/slider
 *
 * @remarks
 * Hidden native input for form submission. Renders one input per
 * thumb value. Auto-rendered by Root when `name` prop is provided.
 */

<script lang="ts">
  // Context
  import { useSliderRoot } from './SliderRoot.vue'

  // Utilities
  import { toRef, toValue } from 'vue'

  export interface SliderHiddenInputProps {
    /** Namespace for context injection from parent Slider.Root */
    namespace?: string
    /** Thumb index to read value from */
    index?: number
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'SliderHiddenInput' })

  const {
    namespace = 'v0:slider:root',
    index = 0,
  } = defineProps<SliderHiddenInputProps>()

  const root = useSliderRoot(namespace)

  const value = toRef(() => root.values.value[index] ?? root.min)
  const isDisabled = toRef(() => toValue(root.disabled))
</script>

<template>
  <input
    :disabled="isDisabled"
    :form="root.form"
    :name="root.name"
    tabindex="-1"
    type="hidden"
    :value
  >
</template>
