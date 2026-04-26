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
  font-size: 12px;
  line-height: 18px;
  color: var(--emerald-error-500, #e5484d);
}
</style>
