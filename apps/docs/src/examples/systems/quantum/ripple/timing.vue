<script setup lang="ts">
  import { QuRipple } from '@paper/quantum'
  import { Button } from '@vuetify/v0'
</script>

<template>
  <div class="quantum-docs-ripple-stack">
    <Button.Root class="quantum-docs-ripple-pad quantum-elevation-2">
      <QuRipple />

      <span class="quantum-docs-ripple-label quantum-type-body-1">The spec's timing</span>
    </Button.Root>

    <Button.Root class="quantum-docs-ripple-pad quantum-docs-ripple-slow quantum-elevation-2">
      <QuRipple />

      <span class="quantum-docs-ripple-label quantum-type-body-1">Slowed five times for inspection</span>
    </Button.Root>
  </div>
</template>

<style>
  .quantum-docs-ripple-stack {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--quantum-spacing-1, 8px);
  }

  /* Tokens are custom properties: a declaration on any ancestor retunes every ripple inside it. */
  .quantum-docs-ripple-slow {
    --quantum-ripple-duration: 1500ms;
    --quantum-duration-leave: 975ms;
  }

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
