<script setup lang="ts">
  import { QuRipple } from '@paper/quantum'
  import { Button } from '@vuetify/v0'
</script>

<template>
  <Button.Root class="quantum-docs-ripple-pad quantum-elevation-2">
    <QuRipple />

    <span class="quantum-docs-ripple-label quantum-type-body-1">Press anywhere on this sheet</span>
  </Button.Root>
</template>

<style>
  .quantum-docs-ripple-pad {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 100%;
    max-width: 320px;
    height: 120px;
    margin: 0;
    padding: var(--quantum-spacing-2, 16px);
    border: 0;
    border-radius: var(--quantum-radius, 2px);
    background: var(--quantum-surface, #FFFFFF);
    color: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
    font: inherit;
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }

  .quantum-docs-ripple-pad:focus-visible {
    outline: 2px solid var(--quantum-accent, #FF4081);
    outline-offset: 2px;
  }

  .quantum-docs-ripple-label {
    position: relative;
  }
</style>
