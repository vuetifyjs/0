<script setup lang="ts">
  import { QuChip } from '@paper/quantum'

  import { shallowRef } from 'vue'

  const opened = shallowRef('')
</script>

<template>
  <div class="quantum-docs-stack">
    <div class="quantum-docs-row">
      <QuChip icon="place" @click="opened = 'Toronto'">Toronto</QuChip>

      <QuChip icon="event" @click="opened = 'This week'">This week</QuChip>

      <QuChip icon="label" @click="opened = 'Travel'">Travel</QuChip>
    </div>

    <span v-if="opened" class="quantum-docs-note" role="status">Showing details for {{ opened }}</span>
  </div>
</template>

<style>
  .quantum-docs-stack {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--quantum-spacing-2, 16px);
  }

  .quantum-docs-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--quantum-spacing-1, 8px);
  }

  .quantum-docs-note {
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-caption-size, 12px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
