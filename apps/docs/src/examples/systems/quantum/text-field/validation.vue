<script setup lang="ts">
  import { QuTextField } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const email = shallowRef('')
  const username = shallowRef('')

  function valid (value: unknown) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value)) || 'Error: enter an address like name@example.com'
  }

  function long (value: unknown) {
    return String(value).length >= 4 || 'Error: use four characters or more'
  }
</script>

<template>
  <div class="quantum-docs-fields">
    <QuTextField
      v-model="email"
      autocomplete="email"
      helper="We send the receipt here"
      inputmode="email"
      label="Email"
      required
      :rules="[valid]"
      type="email"
    />

    <QuTextField v-model="username" label="Username" optional :rules="[long]" />
  </div>
</template>

<style>
  .quantum-docs-fields {
    display: flex;
    flex-direction: column;
    gap: var(--quantum-spacing-2, 16px);
    max-width: 360px;
  }
</style>
