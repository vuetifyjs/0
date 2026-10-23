<script setup lang="ts">
  import { QuTimePicker } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const time = shallowRef('15:30')
</script>

<template>
  <div class="quantum-docs-stack">
    <QuTimePicker v-model="time" class="quantum-elevation-24" />

    <span class="quantum-docs-note" role="status">Selected: {{ time }}</span>
  </div>
</template>

<style>
  .quantum-docs-stack {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--quantum-spacing-2, 16px);
  }

  .quantum-docs-note {
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-caption-size, 12px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
