<script setup lang="ts">
  import { QuButton, QuSnackbar } from '@paper/quantum'
  import { shallowRef } from 'vue'

  // Shown on load so the bar is visible; it still leaves after the 6000 ms default.
  const open = shallowRef(true)
</script>

<template>
  <div class="quantum-docs-screen quantum-docs-snackbar-screen">
    <QuButton variant="raised" @click="open = true">Send</QuButton>

    <QuSnackbar.Portal :teleport="false">
      <QuSnackbar v-model="open" align="start">Message sent</QuSnackbar>
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
