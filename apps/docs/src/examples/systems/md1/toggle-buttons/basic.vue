<script setup lang="ts">
  import { Md1ToggleButtons } from '@paper/md1'

  import { shallowRef } from 'vue'

  const period = shallowRef<string>()
</script>

<template>
  <div class="md1-docs-stack">
    <Md1ToggleButtons v-model="period" label="Period">
      <Md1ToggleButtons.Item value="day">Day</Md1ToggleButtons.Item>

      <Md1ToggleButtons.Item value="week">Week</Md1ToggleButtons.Item>

      <Md1ToggleButtons.Item value="month">Month</Md1ToggleButtons.Item>
    </Md1ToggleButtons>

    <span class="md1-docs-note" role="status">{{ period ? `Showing one ${period}` : 'No period selected' }}</span>
  </div>
</template>

<style>
  .md1-docs-stack {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--md1-spacing-2, 16px);
  }

  .md1-docs-note {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
