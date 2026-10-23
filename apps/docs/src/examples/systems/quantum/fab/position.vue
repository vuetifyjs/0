<script setup lang="ts">
  import { QuButton, QuFab } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const position = shallowRef<'end' | 'start'>('end')
</script>

<template>
  <div class="quantum-docs-screen quantum-docs-fab-screen">
    <div class="quantum-docs-fab-bar">
      <QuButton :variant="position === 'end' ? 'raised' : 'flat'" @click="position = 'end'">End</QuButton>

      <QuButton :variant="position === 'start' ? 'raised' : 'flat'" @click="position = 'start'">Start</QuButton>
    </div>

    <QuFab aria-label="Navigate" icon="near-me" :position />
  </div>
</template>

<style>
  .quantum-docs-fab-screen {
    background: var(--quantum-background, #FAFAFA);
  }

  .quantum-docs-fab-bar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--quantum-spacing-1, 8px);
    padding: var(--quantum-spacing-2, 16px);
  }
</style>
