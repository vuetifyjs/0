<script setup lang="ts">
  import { Md1TextField } from '@paper/md1'
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
  <div class="md1-docs-fields">
    <Md1TextField
      v-model="email"
      autocomplete="email"
      helper="We send the receipt here"
      inputmode="email"
      label="Email"
      required
      :rules="[valid]"
      type="email"
    />

    <Md1TextField v-model="username" label="Username" optional :rules="[long]" />
  </div>
</template>

<style>
  .md1-docs-fields {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-2, 16px);
    max-width: 360px;
  }
</style>
