<script setup lang="ts">
  import { QuToggleButtons } from '@paper/quantum'

  import { shallowRef } from 'vue'

  const align = shallowRef('left')
</script>

<template>
  <div class="quantum-docs-stack">
    <QuToggleButtons v-model="align" label="Alignment" mandatory>
      <QuToggleButtons.Item value="left">Left</QuToggleButtons.Item>

      <QuToggleButtons.Item value="center">Center</QuToggleButtons.Item>

      <QuToggleButtons.Item value="right">Right</QuToggleButtons.Item>
    </QuToggleButtons>

    <span class="quantum-docs-note" role="status">Aligned {{ align }}</span>
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
