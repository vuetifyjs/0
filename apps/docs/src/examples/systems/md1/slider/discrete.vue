<script setup lang="ts">
  import { Md1Slider } from '@paper/md1'
  import { shallowRef } from 'vue'

  const level = shallowRef(30)
</script>

<template>
  <div class="md1-docs-sliders md1-docs-sliders-pinned">
    <Md1Slider v-model="level" discrete label="Brightness" :step="10" />
  </div>
</template>

<style>
  .md1-docs-sliders {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-3, 24px);
    max-width: 400px;
  }

  /* Room above the track for the value pin, which rises 40 dp over the centreline. */
  .md1-docs-sliders-pinned {
    padding-top: var(--md1-spacing-4, 32px);
  }
</style>
