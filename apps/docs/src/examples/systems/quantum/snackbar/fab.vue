<script setup lang="ts">
  import { QuFab, QuSnackbar } from '@paper/quantum'
  import { shallowRef } from 'vue'

  // Shown on load so the bar is visible; it still leaves after the 6000 ms default.
  const open = shallowRef(true)
</script>

<template>
  <div class="quantum-docs-screen quantum-docs-snackbar-screen">
    <QuFab aria-label="Compose" icon="edit" @click="open = true" />

    <QuSnackbar.Portal :teleport="false">
      <QuSnackbar v-model="open" action="Undo">Draft discarded</QuSnackbar>
    </QuSnackbar.Portal>
  </div>
</template>

<style>
  .quantum-docs-snackbar-screen {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--quantum-spacing-2, 16px);
    box-sizing: border-box;
    padding: var(--quantum-spacing-2, 16px);
    background: var(--quantum-background, #FAFAFA);
  }
</style>
