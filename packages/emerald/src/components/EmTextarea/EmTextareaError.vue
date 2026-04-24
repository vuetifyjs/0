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
  font-family: Manrope, system-ui, -apple-system, sans-serif;
  font-size: 11px;
  font-weight: 500;
  line-height: 16px;
  color: var(--emerald-error-500, #e5484d);
}
</style>
