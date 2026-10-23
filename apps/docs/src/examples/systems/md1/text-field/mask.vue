<script setup lang="ts">
  import { Md1TextField } from '@paper/md1'
  import { shallowRef } from 'vue'

  const phone = shallowRef('')
  const card = shallowRef('')
</script>

<template>
  <div class="md1-docs-fields">
    <Md1TextField
      v-model="phone"
      inputmode="tel"
      label="Phone"
      mask="(###) ###-####"
    />

    <Md1TextField
      v-model="card"
      inputmode="numeric"
      label="Card number"
      mask="#### #### #### ####"
    />

    <span class="md1-docs-note" role="status">Model: {{ phone || '(empty)' }} / {{ card || '(empty)' }}</span>
  </div>
</template>

<style>
  .md1-docs-fields {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-2, 16px);
    max-width: 360px;
  }

  .md1-docs-note {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
