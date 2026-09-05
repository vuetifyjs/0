<script setup lang="ts">
  import { EmTextarea } from '@paper/emerald'

  import { shallowRef } from 'vue'

  const message = shallowRef('')
</script>

<template>
  <div class="emerald-docs-stack">
    <EmTextarea
      v-model="message"
      description="Include order details if relevant."
      label="Message"
      placeholder="How can we help?"
      :rows="4"
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
