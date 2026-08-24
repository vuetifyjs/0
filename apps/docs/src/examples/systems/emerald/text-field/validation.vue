<script setup lang="ts">
  import { EmTextField } from '@paper/emerald'

  import { isString } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const email = shallowRef('')

  function required (value: unknown) {
    return isString(value) && value.length > 0 ? true : 'Email is required.'
  }

  function shaped (value: unknown) {
    if (!isString(value) || value.length === 0) return true

    return value.includes('@') ? true : 'That does not look like an email address.'
  }
</script>

<template>
  <div class="emerald-docs-stack">
    <EmTextField
      v-model="email"
      label="Email"
      placeholder="you@example.com"
      required
      :rules="[required, shaped]"
      type="email"
      validate-on="blur lazy"
    />
  </div>
</template>

<style>
  .emerald-docs-stack {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-m, 16px);
    max-width: 360px;
  }
</style>
