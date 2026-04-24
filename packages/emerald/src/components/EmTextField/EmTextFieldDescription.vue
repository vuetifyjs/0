<script lang="ts">
  // Framework
  import { InputDescription } from '@vuetify/v0'

  export interface EmTextFieldDescriptionProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmTextFieldDescription' })
</script>

<template>
  <InputDescription class="emerald-text-field__description">
    <slot />
  </InputDescription>
</template>

<style>
.emerald-text-field__description {
  font-family: Manrope, system-ui, -apple-system, sans-serif;
  font-size: 12px;
  line-height: 18px;
  color: rgb(var(--emerald-neutral-channels, 26 28 30) / 0.6);
}
</style>
