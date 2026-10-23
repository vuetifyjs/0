<script setup lang="ts">
  import { QuSlider } from '@paper/quantum'
</script>

<template>
  <div class="quantum-docs-sliders">
    <QuSlider disabled icon-end="add" icon-start="remove" label="Call volume" :model-value="50" />

    <QuSlider disabled editable label="Contrast" :model-value="20" />
  </div>
</template>

<style>
  .quantum-docs-sliders {
    display: flex;
    flex-direction: column;
    gap: var(--quantum-spacing-3, 24px);
    max-width: 400px;
  }
</style>
