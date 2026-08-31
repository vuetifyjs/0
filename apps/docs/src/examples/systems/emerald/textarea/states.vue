<script setup lang="ts">
  import { EmTextarea } from '@paper/emerald'

  import { shallowRef } from 'vue'

  const key = shallowRef('-----BEGIN PUBLIC KEY-----\nMFkwEwYHKoZIzj0CAQYIKoZI\n-----END PUBLIC KEY-----')
  const notes = shallowRef('Migrated from the legacy account.')
  const bio = shallowRef('')
</script>

<template>
  <div class="emerald-docs-stack">
    <EmTextarea
      v-model="key"
      description="Generated when the account was created."
      label="Public key"
      readonly
      :rows="3"
    />

    <EmTextarea
      v-model="notes"
      disabled
      label="Internal notes"
      :rows="2"
    />

    <EmTextarea
      v-model="bio"
      error
      error-messages="Profiles cannot be published without a bio."
      label="Bio"
      :rows="3"
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
