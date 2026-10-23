<script setup lang="ts">
  import { Md1Slider } from '@paper/md1'
  import { shallowRef } from 'vue'

  const volume = shallowRef(60)
  const zoom = shallowRef(25)
</script>

<template>
  <div class="md1-docs-sliders">
    <Md1Slider v-model="volume" icon-end="add" icon-start="remove" label="Media volume" />

    <Md1Slider v-model="zoom" icon-end="zoom-in" label="Zoom" />
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
