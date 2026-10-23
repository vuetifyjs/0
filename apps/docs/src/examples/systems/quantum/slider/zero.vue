<script setup lang="ts">
  import { QuSlider } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const alarm = shallowRef(0)
  const ringtone = shallowRef(35)
</script>

<template>
  <div class="quantum-docs-sliders">
    <QuSlider v-model="alarm" label="Alarm volume" />

    <QuSlider v-model="ringtone" label="Ringtone volume" />
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
