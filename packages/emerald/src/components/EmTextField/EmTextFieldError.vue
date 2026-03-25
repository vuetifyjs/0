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
