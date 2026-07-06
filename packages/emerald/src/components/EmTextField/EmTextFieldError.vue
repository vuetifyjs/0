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
  font-size: var(--emerald-text-b3-size, 12px);
  font-weight: var(--emerald-text-b3-weight, 400);
  line-height: var(--emerald-text-b3-height, 18px);
  color: var(--emerald-danger-600, #A1000E);
}
</style>
