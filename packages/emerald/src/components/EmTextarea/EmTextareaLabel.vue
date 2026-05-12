<script lang="ts">
  // Framework
  import { useInputRoot } from '@vuetify/v0'

  export interface EmTextareaLabelProps {
    for?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmTextareaLabel' })

  const root = useInputRoot('v0:input:root')
</script>

<template>
  <label
    class="emerald-textarea__label"
    :for="root.id as string"
  >
    <slot />
  </label>
</template>

<style>
.emerald-textarea__label {
  display: inline-block;
  font-family: Manrope, system-ui, -apple-system, sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  color: var(--emerald-on-background, #1a1c1e);
}
</style>
