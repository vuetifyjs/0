<script setup lang="ts">
  import { Md1ToggleButtons } from '@paper/md1'

  import { shallowRef } from 'vue'

  const size = shallowRef<string>()
</script>

<template>
  <div class="md1-docs-stack">
    <Md1ToggleButtons disabled label="Period">
      <Md1ToggleButtons.Item value="day">Day</Md1ToggleButtons.Item>

      <Md1ToggleButtons.Item value="week">Week</Md1ToggleButtons.Item>

      <Md1ToggleButtons.Item value="month">Month</Md1ToggleButtons.Item>
    </Md1ToggleButtons>

    <Md1ToggleButtons v-model="size" label="Size">
      <Md1ToggleButtons.Item value="small">Small</Md1ToggleButtons.Item>

      <Md1ToggleButtons.Item value="medium">Medium</Md1ToggleButtons.Item>

      <Md1ToggleButtons.Item disabled value="large">Large</Md1ToggleButtons.Item>
    </Md1ToggleButtons>
  </div>
</template>

<style>
  .md1-docs-stack {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--md1-spacing-2, 16px);
  }
</style>
