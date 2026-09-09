/**
 * @module OtpHiddenInput
 *
 * @see https://0.vuetifyjs.com/components/forms/otp
 *
 * @remarks
 * Hidden native input for form submission. Auto-rendered by Root
 * when `name` prop is provided. Same pattern as Rating.HiddenInput.
 */

<script lang="ts">
  // Context
  import { useOtpRoot } from './OtpRoot.vue'

  // Utilities
  import { toRef } from 'vue'

  export interface OtpHiddenInputProps {
    /** Namespace for context injection from parent Otp.Root */
    namespace?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'OtpHiddenInput' })

  const {
    namespace = 'v0:otp:root',
  } = defineProps<OtpHiddenInputProps>()

  const root = useOtpRoot(namespace)

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
