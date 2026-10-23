<script setup lang="ts">
  import { Md1IconToggle } from '@paper/md1'
</script>

<template>
  <div class="md1-docs-row">
    <Md1IconToggle aria-label="Star" icon="star-border" icon-on="star" />

    <Md1IconToggle aria-label="Star" icon="star-border" icon-on="star" :model-value="true" />

    <Md1IconToggle aria-label="Star" disabled icon="star-border" icon-on="star" />

    <Md1IconToggle
      aria-label="Star"
      disabled
      icon="star-border"
      icon-on="star"
      :model-value="true"
    />
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
</style>
