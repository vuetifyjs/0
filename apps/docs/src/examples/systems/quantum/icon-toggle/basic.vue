<script setup lang="ts">
  import { QuIconToggle } from '@paper/quantum'

  import { shallowRef } from 'vue'

  const starred = shallowRef(false)
</script>

<template>
  <div class="quantum-docs-row">
    <QuIconToggle v-model="starred" aria-label="Star" icon="star-border" icon-on="star" />

    <span class="quantum-docs-note" role="status">{{ starred ? 'Starred' : 'Not starred' }}</span>
  </div>
</template>

<style>
  .quantum-docs-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--quantum-spacing-1, 8px);
  }

  .quantum-docs-note {
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-caption-size, 12px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
