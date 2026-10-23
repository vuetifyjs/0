<script setup lang="ts">
  import { QuIconToggle } from '@paper/quantum'
</script>

<template>
  <div class="quantum-docs-row">
    <QuIconToggle aria-label="Star" icon="star-border" icon-on="star" />

    <QuIconToggle aria-label="Star" icon="star-border" icon-on="star" :model-value="true" />

    <QuIconToggle aria-label="Star" disabled icon="star-border" icon-on="star" />

    <QuIconToggle
      aria-label="Star"
      disabled
      icon="star-border"
      icon-on="star"
      :model-value="true"
    />
  </div>
</template>

<style>
  .quantum-docs-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--quantum-spacing-1, 8px);
  }
</style>
