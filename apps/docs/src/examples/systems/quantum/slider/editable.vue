<script setup lang="ts">
  import { QuSlider } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const saturation = shallowRef(72)
</script>

<template>
  <div class="quantum-docs-sliders">
    <QuSlider v-model="saturation" editable label="Colour saturation" />
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
