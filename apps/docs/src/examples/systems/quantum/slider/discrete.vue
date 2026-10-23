<script setup lang="ts">
  import { QuSlider } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const level = shallowRef(30)
</script>

<template>
  <div class="quantum-docs-sliders quantum-docs-sliders-pinned">
    <QuSlider v-model="level" discrete label="Brightness" :step="10" />
  </div>
</template>

<style>
  .quantum-docs-sliders {
    display: flex;
    flex-direction: column;
    gap: var(--quantum-spacing-3, 24px);
    max-width: 400px;
  }

  /* Room above the track for the value pin, which rises 40 dp over the centreline. */
  .quantum-docs-sliders-pinned {
    padding-top: var(--quantum-spacing-4, 32px);
  }
</style>
