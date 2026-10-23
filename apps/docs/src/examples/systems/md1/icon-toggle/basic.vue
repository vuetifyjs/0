<script setup lang="ts">
  import { Md1IconToggle } from '@paper/md1'

  import { shallowRef } from 'vue'

  const starred = shallowRef(false)
</script>

<template>
  <div class="md1-docs-row">
    <Md1IconToggle v-model="starred" aria-label="Star" icon="star-border" icon-on="star" />

    <span class="md1-docs-note" role="status">{{ starred ? 'Starred' : 'Not starred' }}</span>
  </div>
</template>

<style>
  .md1-docs-row {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: var(--md1-spacing-1, 8px);
  }

  .md1-docs-note {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
