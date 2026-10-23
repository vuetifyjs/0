<script setup lang="ts">
  import { Md1Button, Md1Snackbar } from '@paper/md1'
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
  <div class="md1-docs-screen md1-docs-snackbar-screen">
    <p class="md1-docs-snackbar-note" role="status">
      {{ archived ? 'The conversation is in the archive.' : 'The conversation is back in the inbox.' }}
    </p>

    <Md1Button variant="raised" @click="onArchive">Archive</Md1Button>

    <Md1Snackbar.Portal :teleport="false">
      <Md1Snackbar v-model="open" action="Undo" @action="onUndo">Conversation archived</Md1Snackbar>
    </Md1Snackbar.Portal>
  </div>
</template>

<style>
  .md1-docs-snackbar-screen {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--md1-spacing-2, 16px);
    box-sizing: border-box;
    padding: var(--md1-spacing-2, 16px);
    background: var(--md1-background, #FAFAFA);
  }

  .md1-docs-snackbar-note {
    margin: 0;
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-body-1-size, 14px);
    line-height: var(--md1-type-body-1-leading, 20px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
