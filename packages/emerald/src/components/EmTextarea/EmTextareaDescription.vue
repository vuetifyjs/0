<script lang="ts">
  // Framework
  import { InputDescription } from '@vuetify/v0'

  export interface EmTextareaDescriptionProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmTextareaDescription' })
</script>

<template>
  <InputDescription class="emerald-textarea__description">
    <slot />
  </InputDescription>
</template>

<style>
.emerald-textarea__description {
  font-family: var(--emerald-font-sans, Manrope, system-ui, -apple-system, sans-serif);
  font-size: var(--emerald-text-b3-size, 12px);
  font-weight: var(--emerald-text-b3-weight, 400);
  line-height: var(--emerald-text-b3-height, 18px);
  color: var(--emerald-neutral-700, #757e85);
}
</style>
