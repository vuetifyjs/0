<script setup lang="ts">
  import { QuIconToggle } from '@paper/quantum'
</script>

<template>
  <div class="quantum-docs-row">
    <QuIconToggle aria-label="Favourite" icon="favorite-border" icon-on="favorite" />

    <span class="quantum-docs-note">Unbounded</span>

    <QuIconToggle aria-label="Favourite" icon="favorite-border" icon-on="favorite" :unbounded="false" />

    <span class="quantum-docs-note">Bounded</span>
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
