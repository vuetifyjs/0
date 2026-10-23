<script setup lang="ts">
  import { QuTimePicker } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const time = shallowRef('09:10')
</script>

<template>
  <div class="quantum-docs-scroll">
    <QuTimePicker v-model="time" class="quantum-elevation-24" landscape />
  </div>
</template>

<style>
  /* The 512 dp landscape sheet is wider than a phone in portrait; the frame scrolls rather than squeezing it. */
  .quantum-docs-scroll {
    max-width: 100%;
    padding: var(--quantum-spacing-3, 24px) 0;
    overflow-x: auto;
  }
</style>
