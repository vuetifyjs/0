<script setup lang="ts">
  import { Md1TextField } from '@paper/md1'
  import { shallowRef } from 'vue'

  const feedback = shallowRef('')
</script>

<template>
  <div class="md1-docs-fields">
    <Md1TextField
      v-model="feedback"
      label="Feedback"
      placeholder="What worked, and what did not?"
      textarea
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
