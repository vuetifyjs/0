<script setup lang="ts">
  import { EmTextField } from '@paper/emerald'

  import { shallowRef } from 'vue'

  const email = shallowRef('')
</script>

<template>
  <div class="emerald-docs-stack">
    <EmTextField
      v-model="email"
      description="We never share this."
      label="Email"
      placeholder="you@example.com"
      type="email"
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
