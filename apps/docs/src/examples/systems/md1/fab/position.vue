<script setup lang="ts">
  import { Md1Button, Md1Fab } from '@paper/md1'
  import { shallowRef } from 'vue'

  const position = shallowRef<'end' | 'start'>('end')
</script>

<template>
  <div class="md1-docs-screen md1-docs-fab-screen">
    <div class="md1-docs-fab-bar">
      <Md1Button :variant="position === 'end' ? 'raised' : 'flat'" @click="position = 'end'">End</Md1Button>

      <Md1Button :variant="position === 'start' ? 'raised' : 'flat'" @click="position = 'start'">Start</Md1Button>
    </div>

    <Md1Fab aria-label="Navigate" icon="near-me" :position />
  </div>
</template>

<style>
  .md1-docs-fab-screen {
    background: var(--md1-background, #FAFAFA);
  }

  .md1-docs-fab-bar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--md1-spacing-1, 8px);
    padding: var(--md1-spacing-2, 16px);
  }
</style>
