<script lang="ts">
  // Framework
  import { InputError } from '@vuetify/v0'

  export interface EmTextareaErrorProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmTextareaError' })
</script>

<template>
  <InputError class="emerald-textarea__error">
    <template #default="{ errors }">
      <slot :errors />
    </template>
  </InputError>
</template>

<style>
.emerald-textarea__error {
  font-family: var(--emerald-font-sans, Manrope, system-ui, -apple-system, sans-serif);
  font-size: var(--emerald-text-b3-size, 12px);
  font-weight: var(--emerald-text-b3-weight, 400);
  line-height: var(--emerald-text-b3-height, 18px);
  color: var(--emerald-danger-600, #a1000e);
}
</style>
