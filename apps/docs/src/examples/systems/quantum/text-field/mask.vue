<script setup lang="ts">
  import { QuTextField } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const phone = shallowRef('')
  const card = shallowRef('')
</script>

<template>
  <div class="quantum-docs-fields">
    <QuTextField
      v-model="phone"
      inputmode="tel"
      label="Phone"
      mask="(###) ###-####"
    />

    <QuTextField
      v-model="card"
      inputmode="numeric"
      label="Card number"
      mask="#### #### #### ####"
    />

    <span class="quantum-docs-note" role="status">Model: {{ phone || '(empty)' }} / {{ card || '(empty)' }}</span>
  </div>
</template>

<style>
  .quantum-docs-fields {
    display: flex;
    flex-direction: column;
    gap: var(--quantum-spacing-2, 16px);
    max-width: 360px;
  }

  .quantum-docs-note {
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-caption-size, 12px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
