<script setup lang="ts">
  import { Md1IconToggle } from '@paper/md1'

  import { shallowRef } from 'vue'

  const starred = shallowRef(false)
</script>

<template>
  <div class="md1-docs-icon-toggle-stack">
    <Md1IconToggle v-model="starred" aria-label="Star" icon="star-border" icon-on="star" />

    <p class="md1-docs-readout md1-docs-note" role="status">{{ starred ? 'Starred' : 'Not starred' }}</p>
  </div>
</template>

<style>
  /*
   * The toggle on top and its readout below, each centred on its own, so the
   * readout changing never moves the toggle.
   */
  .md1-docs-icon-toggle-stack {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--md1-spacing-1, 8px);
  }

  .md1-docs-note {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
