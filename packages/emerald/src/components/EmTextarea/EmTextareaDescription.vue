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
  font-family: Manrope, system-ui, -apple-system, sans-serif;
  font-size: 11px;
  font-weight: 400;
  line-height: 16px;
  color: rgb(var(--emerald-neutral-channels, 26 28 30) / 0.6);
}
</style>
