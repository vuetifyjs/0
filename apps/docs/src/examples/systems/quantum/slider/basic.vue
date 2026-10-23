<script setup lang="ts">
  import { QuSlider } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const volume = shallowRef(40)
</script>

<template>
  <div class="quantum-docs-sliders">
    <QuSlider v-model="volume" label="Volume" />
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
