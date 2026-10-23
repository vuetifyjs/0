<script setup lang="ts">
  import { Md1TimePicker } from '@paper/md1'
  import { shallowRef } from 'vue'

  const time = shallowRef('18:45')
</script>

<template>
  <div class="md1-docs-stack">
    <Md1TimePicker v-model="time" class="md1-elevation-24" format="24" />

    <span class="md1-docs-note" role="status">Selected: {{ time }}</span>
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
