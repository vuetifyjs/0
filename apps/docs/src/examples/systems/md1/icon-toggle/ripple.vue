<script setup lang="ts">
  import { Md1IconToggle } from '@paper/md1'
</script>

<template>
  <div class="md1-docs-row">
    <Md1IconToggle aria-label="Favourite" icon="favorite-border" icon-on="favorite" />

    <span class="md1-docs-note">Unbounded</span>

    <Md1IconToggle aria-label="Favourite" icon="favorite-border" icon-on="favorite" :unbounded="false" />

    <span class="md1-docs-note">Bounded</span>
  </div>
</template>

<style>
  .md1-docs-note {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
