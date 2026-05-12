<script lang="ts">
  // Framework
  import { useInputRoot } from '@vuetify/v0'

  export interface EmTextFieldLabelProps {
    for?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmTextFieldLabel' })

  const root = useInputRoot('v0:input:root')
</script>

<template>
  <label
    class="emerald-text-field__label"
    :for="root.id as string"
  >
    <slot />
  </label>
</template>

<style>
.emerald-text-field__label {
  font-family: Manrope, system-ui, -apple-system, sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: 20px;
  color: var(--emerald-primary-950, #221065);
}
</style>
