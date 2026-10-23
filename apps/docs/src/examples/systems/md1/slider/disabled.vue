<script setup lang="ts">
  import { Md1Slider } from '@paper/md1'
</script>

<template>
  <div class="md1-docs-sliders">
    <Md1Slider
      disabled
      icon-end="add"
      icon-start="remove"
      label="Call volume"
      :model-value="50"
    />

    <Md1Slider disabled editable label="Contrast" :model-value="20" />
  </div>
</template>

<style>
  .md1-docs-sliders {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-3, 24px);
    max-width: 400px;
  }
</style>
