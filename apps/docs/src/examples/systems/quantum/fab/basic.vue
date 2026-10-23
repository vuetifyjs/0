<script setup lang="ts">
  import { QuFab } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const count = shallowRef(0)
</script>

<template>
  <div class="quantum-docs-screen quantum-docs-fab-screen">
    <p class="quantum-docs-fab-note" role="status">
      {{ count === 0 ? 'No drafts yet.' : `${count} draft${count === 1 ? '' : 's'} started.` }}
    </p>

    <QuFab aria-label="Compose" icon="edit" @click="count++" />
  </div>
</template>

<style>
  .quantum-docs-fab-screen {
    background: var(--quantum-background, #FAFAFA);
  }

  .quantum-docs-fab-note {
    margin: 0;
    padding: var(--quantum-spacing-2, 16px);
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-body-1-size, 14px);
    line-height: var(--quantum-type-body-1-leading, 20px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
