/**
 * @module RatingHiddenInput
 *
 * @see https://0.vuetifyjs.com/components/forms/rating
 *
 * @remarks
 * Hidden native input for form submission. Auto-rendered by Root
 * when `name` prop is provided. Same pattern as Slider.HiddenInput.
 */

<script lang="ts">
  // Context
  import { useRatingRoot } from './RatingRoot.vue'

  // Utilities
  import { toRef } from 'vue'

  export interface RatingHiddenInputProps {
    /** Namespace for context injection from parent Rating.Root */
    namespace?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'RatingHiddenInput' })

  const {
    namespace = 'v0:rating:root',
  } = defineProps<RatingHiddenInputProps>()

  const root = useRatingRoot(namespace)

  const value = toRef(() => root.value.value)
  const isDisabled = toRef(() => root.isDisabled.value)
</script>

<template>
  <input
    :disabled="isDisabled"
    :name="root.name"
    tabindex="-1"
    type="hidden"
    :value
  >
</template>
