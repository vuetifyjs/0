<script setup lang="ts">
  import { Md1Button, Md1Card, Md1Snackbar, Md1Toolbar } from '@paper/md1'
  import { shallowRef } from 'vue'

  // Shown on load, as the guidelines' figure catches it; the microphone asks again.
  const open = shallowRef(true)
  const settings = shallowRef(false)

  function onSettings () {
    settings.value = true
  }
</script>

<template>
  <div class="md1-docs-screen md1-docs-permission-screen">
    <Md1Toolbar variant="primary">
      <Md1Toolbar.Nav aria-label="Open navigation" />

      <Md1Toolbar.Title>Notes</Md1Toolbar.Title>

      <Md1Toolbar.Actions>
        <Md1Button aria-label="Search" icon="search" />
      </Md1Toolbar.Actions>
    </Md1Toolbar>

    <div class="md1-docs-permission-body">
      <Md1Card>
        <p class="md1-docs-permission-quick">Add quick note</p>

        <div aria-label="New note" class="md1-docs-permission-kinds" role="group">
          <Md1Button aria-label="Text note" icon="edit" />

          <Md1Button aria-label="List" icon="reorder" />

          <Md1Button aria-label="Voice note" icon="mic" @click="open = true" />

          <Md1Button aria-label="Photo note" icon="photo" />
        </div>
      </Md1Card>

      <p v-if="settings" class="md1-docs-permission-note" role="status">Opening the app's permission settings</p>
    </div>

    <Md1Snackbar.Portal :teleport="false">
      <Md1Snackbar v-model="open" action="Settings" multiline @action="onSettings">
        To record voice notes, allow Notes permission to record audio.
      </Md1Snackbar>
    </Md1Snackbar.Portal>
  </div>
</template>

<style>
  .md1-docs-permission-screen {
    width: 100%;
    max-width: 360px;
    background: var(--md1-background, #FAFAFA);
  }

  .md1-docs-permission-body {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-2, 16px);
    padding: var(--md1-spacing-1, 8px);
  }

  .md1-docs-permission-quick {
    margin: 0;
    padding: var(--md1-spacing-2, 16px);
    border-bottom: 1px solid var(--md1-divider, rgba(0, 0, 0, 0.12));
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-subheading-size, 16px);
    color: var(--md1-text-hint, rgba(0, 0, 0, 0.38));
  }

  .md1-docs-permission-kinds {
    display: flex;
    justify-content: space-around;
    padding: var(--md1-spacing-1, 8px) 0;
  }

  .md1-docs-permission-kinds .md1-button {
    color: var(--md1-icon-active, rgba(0, 0, 0, 0.54));
  }

  .md1-docs-permission-note {
    margin: 0;
    padding-inline: var(--md1-spacing-1, 8px);
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
