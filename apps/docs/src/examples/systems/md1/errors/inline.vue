<script setup lang="ts">
  import { Md1TextField } from '@paper/md1'
  import { shallowRef } from 'vue'

  const phone = shallowRef('')
  const name = shallowRef('')

  function digits (value: unknown) {
    return String(value).replace(/\D/g, '').length >= 7 || 'Enter a phone number with at least 7 digits'
  }
</script>

<template>
  <div class="md1-docs-errors-fields">
    <Md1TextField
      v-model="phone"
      autocomplete="tel"
      helper="We text a sign-in code to this number"
      inputmode="tel"
      label="Phone"
      :rules="[digits]"
      type="tel"
    />

    <Md1TextField v-model="name" autocomplete="name" label="Name" />
  </div>
</template>

<style>
  .md1-docs-errors-fields {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-2, 16px);
    max-width: 360px;
  }
</style>
