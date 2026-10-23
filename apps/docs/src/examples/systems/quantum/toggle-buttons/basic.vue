<script setup lang="ts">
  import { QuToggleButtons } from '@paper/quantum'

  import { shallowRef } from 'vue'

  const period = shallowRef<string>()
</script>

<template>
  <div class="quantum-docs-stack">
    <QuToggleButtons v-model="period" label="Period">
      <QuToggleButtons.Item value="day">Day</QuToggleButtons.Item>

      <QuToggleButtons.Item value="week">Week</QuToggleButtons.Item>

      <QuToggleButtons.Item value="month">Month</QuToggleButtons.Item>
    </QuToggleButtons>

    <span class="quantum-docs-note" role="status">{{ period ? `Showing one ${period}` : 'No period selected' }}</span>
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
