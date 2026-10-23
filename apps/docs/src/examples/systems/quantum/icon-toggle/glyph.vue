<script setup lang="ts">
  import { QuIconToggle } from '@paper/quantum'

  import { shallowRef } from 'vue'

  const saved = shallowRef(true)
</script>

<template>
  <div class="quantum-docs-row">
    <QuIconToggle v-model="saved" aria-label="Bookmark" icon="bookmark" />

    <span class="quantum-docs-note" role="status">{{ saved ? 'Bookmarked' : 'Not bookmarked' }}</span>
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
