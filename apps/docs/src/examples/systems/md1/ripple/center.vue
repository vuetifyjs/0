<script setup lang="ts">
  import { Md1Ripple } from '@paper/md1'
  import { Button } from '@vuetify/v0'
</script>

<template>
  <Button.Root class="md1-docs-ripple-pad md1-elevation-2">
    <Md1Ripple center />

    <span class="md1-docs-ripple-label md1-type-body-1">Press a corner: the ink still starts here</span>
  </Button.Root>
</template>

<style>
  .md1-docs-ripple-pad {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 100%;
    max-width: 320px;
    height: 120px;
    margin: 0;
    padding: var(--md1-spacing-2, 16px);
    border: 0;
    border-radius: var(--md1-radius, 2px);
    background: var(--md1-surface, #FFFFFF);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
    font: inherit;
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }

  .md1-docs-ripple-pad:focus-visible {
    outline: 2px solid var(--md1-accent, #FF4081);
    outline-offset: 2px;
  }

  .md1-docs-ripple-label {
    position: relative;
  }
</style>
