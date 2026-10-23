<script setup lang="ts">
  import { QuButton, QuSnackbar } from '@paper/quantum'
  import { shallowRef } from 'vue'

  // Shown on load so the bar is visible; it still leaves after the 6000 ms default.
  const open = shallowRef(true)
  const archived = shallowRef(true)

  function onArchive () {
    archived.value = true
    open.value = true
  }

  function onUndo () {
    archived.value = false
  }
</script>

<template>
  <div class="quantum-docs-screen quantum-docs-snackbar-screen">
    <p class="quantum-docs-snackbar-note" role="status">
      {{ archived ? 'The conversation is in the archive.' : 'The conversation is back in the inbox.' }}
    </p>

    <QuButton variant="raised" @click="onArchive">Archive</QuButton>

    <QuSnackbar.Portal :teleport="false">
      <QuSnackbar v-model="open" action="Undo" @action="onUndo">Conversation archived</QuSnackbar>
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

  .quantum-docs-snackbar-note {
    margin: 0;
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-body-1-size, 14px);
    line-height: var(--quantum-type-body-1-leading, 20px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
