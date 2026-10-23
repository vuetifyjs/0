<script setup lang="ts">
  import { QuSlider } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const volume = shallowRef(60)
  const zoom = shallowRef(25)
</script>

<template>
  <div class="quantum-docs-sliders">
    <QuSlider v-model="volume" icon-end="add" icon-start="remove" label="Media volume" />

    <QuSlider v-model="zoom" icon-end="zoom-in" label="Zoom" />
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
