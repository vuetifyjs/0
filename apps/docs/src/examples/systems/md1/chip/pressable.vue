<script setup lang="ts">
  import { Md1Chip } from '@paper/md1'

  import { shallowRef } from 'vue'

  const opened = shallowRef('')
</script>

<template>
  <div class="md1-docs-stack">
    <div class="md1-docs-row">
      <Md1Chip icon="place" @click="opened = 'Toronto'">Toronto</Md1Chip>

      <Md1Chip icon="event" @click="opened = 'This week'">This week</Md1Chip>

      <Md1Chip icon="label" @click="opened = 'Travel'">Travel</Md1Chip>
    </div>

    <span v-if="opened" class="md1-docs-note" role="status">Showing details for {{ opened }}</span>
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
