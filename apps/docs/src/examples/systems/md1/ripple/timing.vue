<script setup lang="ts">
  import { Md1Ripple } from '@paper/md1'
  import { Button } from '@vuetify/v0'
</script>

<template>
  <div class="md1-docs-ripple-stack">
    <Button.Root class="md1-docs-ripple-pad md1-elevation-2">
      <Md1Ripple />

      <span class="md1-docs-ripple-label md1-type-body-1">The spec's timing</span>
    </Button.Root>

    <Button.Root class="md1-docs-ripple-pad md1-docs-ripple-slow md1-elevation-2">
      <Md1Ripple />

      <span class="md1-docs-ripple-label md1-type-body-1">Slowed five times for inspection</span>
    </Button.Root>
  </div>
</template>

<style>
  .md1-docs-ripple-stack {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--md1-spacing-1, 8px);
  }

  /* Tokens are custom properties: a declaration on any ancestor retunes every ripple inside it. */
  .md1-docs-ripple-slow {
    --md1-ripple-duration: 1500ms;
    --md1-duration-leave: 975ms;
  }

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
