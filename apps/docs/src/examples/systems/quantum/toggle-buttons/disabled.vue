<script setup lang="ts">
  import { QuToggleButtons } from '@paper/quantum'

  import { shallowRef } from 'vue'

  const size = shallowRef<string>()
</script>

<template>
  <div class="quantum-docs-stack">
    <QuToggleButtons disabled label="Period">
      <QuToggleButtons.Item value="day">Day</QuToggleButtons.Item>

      <QuToggleButtons.Item value="week">Week</QuToggleButtons.Item>

      <QuToggleButtons.Item value="month">Month</QuToggleButtons.Item>
    </QuToggleButtons>

    <QuToggleButtons v-model="size" label="Size">
      <QuToggleButtons.Item value="small">Small</QuToggleButtons.Item>

      <QuToggleButtons.Item value="medium">Medium</QuToggleButtons.Item>

      <QuToggleButtons.Item disabled value="large">Large</QuToggleButtons.Item>
    </QuToggleButtons>
  </div>
</template>

<style>
  .quantum-docs-stack {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--quantum-spacing-2, 16px);
  }
</style>
