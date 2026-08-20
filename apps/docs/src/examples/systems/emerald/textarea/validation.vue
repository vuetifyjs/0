<script setup lang="ts">
  import { EmTextarea } from '@paper/emerald'

  import { isString } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const feedback = shallowRef('')

  function required (value: unknown) {
    return isString(value) && value.trim().length > 0 ? true : 'Tell us what happened.'
  }

  function substantial (value: unknown) {
    if (!isString(value) || value.trim().length === 0) return true

    return value.trim().length >= 20 ? true : 'A sentence or two helps us reproduce it — 20 characters minimum.'
  }
</script>

<template>
  <div class="emerald-docs-stack">
    <EmTextarea
      v-model="feedback"
      description="What did you expect, and what happened instead?"
      label="Bug report"
      required
      :rows="4"
      :rules="[required, substantial]"
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
