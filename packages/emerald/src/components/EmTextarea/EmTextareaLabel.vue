<script lang="ts">
  // Framework
  import { useInputRoot } from '@vuetify/v0'

  export interface EmTextareaLabelProps {
    for?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmTextareaLabel' })

  const { for: id } = defineProps<EmTextareaLabelProps>()

  const root = useInputRoot('v0:input:root')
</script>

<template>
  <label
    class="emerald-textarea__label"
    :for="id ?? (root.id as string)"
  >
    <slot />

    <span
      v-if="root.required"
      aria-hidden="true"
      class="emerald-textarea__mandatory"
    >*</span>
  </label>
</template>

<style>
.emerald-textarea__label {
  display: inline-flex;
  align-items: center;
  gap: var(--emerald-spacing-2xs, 4px);
  font-family: var(--emerald-font-sans, Manrope, system-ui, -apple-system, sans-serif);
  font-size: var(--emerald-text-b1-size, 16px);
  font-weight: 700;
  line-height: var(--emerald-text-b1-height, 24px);
  color: var(--emerald-on-background, #2b2d2e);
}

.emerald-textarea__mandatory {
  color: var(--emerald-danger-600, #a1000e);
}
</style>
