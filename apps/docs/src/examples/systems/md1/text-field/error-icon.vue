<script setup lang="ts">
  import { Md1TextField } from '@paper/md1'
  import { shallowRef, toRef } from 'vue'

  const email = shallowRef('jane@example')

  const messages = toRef(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value) ? [] : ['Enter an address like name@example.com'])
</script>

<template>
  <div class="md1-docs-fields">
    <Md1TextField
      v-model="email"
      autocomplete="email"
      error-icon
      :error-messages="messages"
      inputmode="email"
      label="Email"
      type="email"
    />
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
