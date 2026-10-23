<script setup lang="ts">
  import { QuTextField } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const feedback = shallowRef('')
</script>

<template>
  <div class="quantum-docs-fields">
    <QuTextField
      v-model="feedback"
      label="Feedback"
      placeholder="What worked, and what did not?"
      textarea
    />
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
