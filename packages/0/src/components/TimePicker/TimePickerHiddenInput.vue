/**
 * @module TimePickerHiddenInput
 *
 * @see https://0.vuetifyjs.com/components/forms/time-picker
 *
 * @remarks
 * Hidden native input for form submission. Auto-rendered by Root when
 * `name` is set. Submits the canonical 24-hour value, or an empty string
 * while a field is still empty.
 */

<script lang="ts">
  // Context
  import { useTimePickerRoot } from './TimePickerRoot.vue'

  // Utilities
  import { toRef } from 'vue'

  export interface TimePickerHiddenInputProps {
    /** Namespace for connecting to TimePicker.Root. */
    namespace?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'TimePickerHiddenInput' })

  const {
    namespace = 'v0:time-picker',
  } = defineProps<TimePickerHiddenInputProps>()

  const root = useTimePickerRoot(namespace)

  const name = toRef(() => root.name.value)
  const value = toRef(() => root.value.value ?? '')
  const isDisabled = toRef(() => root.isDisabled.value)
</script>

<template>
  <input
    :disabled="isDisabled || undefined"
    inert
    :name
    tabindex="-1"
    type="hidden"
    :value
  >
</template>
