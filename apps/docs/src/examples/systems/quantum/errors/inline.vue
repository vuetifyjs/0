<script setup lang="ts">
  import { QuTextField } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const phone = shallowRef('')
  const name = shallowRef('')

  function digits (value: unknown) {
    return String(value).replace(/\D/g, '').length >= 7 || 'Enter a phone number with at least 7 digits'
  }
</script>

<template>
  <div class="quantum-docs-errors-fields">
    <QuTextField
      v-model="phone"
      autocomplete="tel"
      helper="We text a sign-in code to this number"
      inputmode="tel"
      label="Phone"
      :rules="[digits]"
      type="tel"
    />

    <QuTextField v-model="name" autocomplete="name" label="Name" />
  </div>
</template>

<style>
  .quantum-docs-errors-fields {
    display: flex;
    flex-direction: column;
    gap: var(--quantum-spacing-2, 16px);
    max-width: 360px;
  }
</style>
