<script setup lang="ts">
  import { QuIcon, QuRipple } from '@paper/quantum'
  import { Button } from '@vuetify/v0'
</script>

<template>
  <div class="quantum-docs-motion-ink">
    <Button.Root class="quantum-docs-motion-ink-sheet quantum-elevation-2">
      <QuRipple />

      <span class="quantum-docs-motion-ink-label quantum-type-body-1">Press anywhere on the sheet</span>
    </Button.Root>

    <Button.Root aria-label="Favourite" class="quantum-docs-motion-ink-icon">
      <QuRipple center unbounded />

      <QuIcon class="quantum-docs-motion-ink-label" name="favorite" />
    </Button.Root>
  </div>
</template>

<style>
  .quantum-docs-motion-ink {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--quantum-spacing-3, 24px);
  }

  .quantum-docs-motion-ink-sheet {
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
    color: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
    font: inherit;
    background: var(--quantum-surface, #FFFFFF);
    border: 0;
    border-radius: var(--quantum-radius, 2px);
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }

  /* The 48 dp touch target around a 24 dp glyph; the unbounded ink is the 48 dp circle. */
  .quantum-docs-motion-ink-icon {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: var(--quantum-touch-target, 48px);
    height: var(--quantum-touch-target, 48px);
    margin: 0;
    padding: 0;
    color: var(--quantum-icon-active, rgba(0, 0, 0, 0.54));
    background: transparent;
    border: 0;
    border-radius: 50%;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  .quantum-docs-motion-ink-sheet:focus-visible,
  .quantum-docs-motion-ink-icon:focus-visible {
    outline: 2px solid var(--quantum-accent, #FF4081);
    outline-offset: 2px;
  }

  .quantum-docs-motion-ink-label {
    position: relative;
  }
</style>
