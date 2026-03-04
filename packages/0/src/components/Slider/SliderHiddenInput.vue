/**
 * @module SliderHiddenInput
 *
 * @remarks
 * Hidden native input for form submission. Renders one input per
 * thumb value. Auto-rendered by Root when `name` prop is provided.
 */

<script lang="ts">
  // Components
  import { useSliderRoot } from './SliderRoot.vue'

  // Utilities
  import { toRef, toValue } from 'vue'

  export interface SliderHiddenInputProps {
    /** Namespace for context injection from parent Slider.Root */
    namespace?: string
    /** Thumb index to read value from */
    index?: number
  }

  const visuallyHiddenStyle = {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: '0',
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    border: '0',
  } as const
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
    inert
    :name="root.name"
    :style="visuallyHiddenStyle"
    tabindex="-1"
    type="hidden"
    :value="value"
  >
</template>
