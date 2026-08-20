<script setup lang="ts">
  import { EmTextarea } from '@paper/emerald'

  import { shallowRef } from 'vue'

  const summary = shallowRef('')
  const detail = shallowRef('')
</script>

<template>
  <div class="emerald-docs-stack">
    <EmTextarea
      v-model="summary"
      description="One or two lines."
      label="Summary"
      :rows="2"
    />

    <EmTextarea
      v-model="detail"
      description="As much as it takes."
      label="Full description"
      :rows="6"
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
