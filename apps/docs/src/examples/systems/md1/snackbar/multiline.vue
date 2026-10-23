<script setup lang="ts">
  import { Md1Button, Md1Snackbar } from '@paper/md1'
  import { shallowRef } from 'vue'

  // Shown on load so the bar is visible; it still leaves after the 6000 ms default.
  const open = shallowRef(true)
</script>

<template>
  <div class="md1-docs-screen md1-docs-snackbar-screen">
    <Md1Button variant="raised" @click="open = true">Connect</Md1Button>

    <Md1Snackbar.Portal :teleport="false">
      <Md1Snackbar v-model="open" action="Retry" multiline>
        Connection timed out. Showing limited messages until the network is back.
      </Md1Snackbar>
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
</style>
