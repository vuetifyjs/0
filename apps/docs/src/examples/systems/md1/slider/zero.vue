<script setup lang="ts">
  import { Md1Slider } from '@paper/md1'
  import { shallowRef } from 'vue'

  const alarm = shallowRef(0)
  const ringtone = shallowRef(35)
</script>

<template>
  <div class="md1-docs-sliders">
    <Md1Slider v-model="alarm" label="Alarm volume" />

    <Md1Slider v-model="ringtone" label="Ringtone volume" />
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
