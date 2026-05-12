<script lang="ts">
  // Framework
  import { InputError } from '@vuetify/v0'

  export interface EmTextFieldErrorProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmTextFieldError' })
</script>

<template>
  <InputError class="emerald-text-field__error">
    <template #default="{ errors }">
      <slot :errors />
    </template>
  </InputError>
</template>

<style>
.emerald-text-field__error {
  font-family: Manrope, system-ui, -apple-system, sans-serif;
  font-size: 11px;
  font-weight: 400;
  line-height: 16px;
  color: rgb(var(--emerald-error-500-channels, 229 72 77) / 0.85);
}
</style>
