<script setup lang="ts">
  import { QuIcon } from '@paper/quantum'
</script>

<template>
  <div class="quantum-docs-row">
    <QuIcon class="quantum-docs-icon-ink" name="menu" />

    <QuIcon class="quantum-docs-icon-ink" name="search" />

    <QuIcon class="quantum-docs-icon-ink" name="favorite" />

    <QuIcon class="quantum-docs-icon-ink" name="share" />

    <QuIcon class="quantum-docs-icon-ink" name="more-vert" />
  </div>
</template>

<style>
  .quantum-docs-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--quantum-spacing-1, 8px);
  }

  /* The host sets the ink: active icons on the theme surface. */
  .quantum-docs-icon-ink {
    color: var(--quantum-icon-active, rgba(0, 0, 0, 0.54));
  }
</style>
