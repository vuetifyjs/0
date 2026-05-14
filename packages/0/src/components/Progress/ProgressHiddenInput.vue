/**
 * @module ProgressHiddenInput
 *
 * @remarks
 * Hidden native input for form submission. Auto-rendered by Root
 * when `name` prop is provided. Same pattern as Rating.HiddenInput.
 */

<script lang="ts">
  // Context
  import { useProgressRoot } from './ProgressRoot.vue'

  // Utilities
  import { toRef } from 'vue'

  export interface ProgressHiddenInputProps {
    /** Namespace for context injection from parent Progress.Root */
    namespace?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'ProgressHiddenInput' })

  const {
    namespace = 'v0:progress:root',
  } = defineProps<ProgressHiddenInputProps>()

  const root = useProgressRoot(namespace)

  const value = toRef(() => root.total.value)
</script>

<template>
  <input
    :name="root.name"
    tabindex="-1"
    type="hidden"
    :value
  >
</template>
