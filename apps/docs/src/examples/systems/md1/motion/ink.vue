<script setup lang="ts">
  import { Md1Icon, Md1Ripple } from '@paper/md1'
  import { Button } from '@vuetify/v0'
</script>

<template>
  <div class="md1-docs-motion-ink">
    <Button.Root class="md1-docs-motion-ink-sheet md1-elevation-2">
      <Md1Ripple />

      <span class="md1-docs-motion-ink-label md1-type-body-1">Press anywhere on the sheet</span>
    </Button.Root>

    <Button.Root aria-label="Favourite" class="md1-docs-motion-ink-icon">
      <Md1Ripple center unbounded />

      <Md1Icon class="md1-docs-motion-ink-label" name="favorite" />
    </Button.Root>
  </div>
</template>

<style>
  .md1-docs-motion-ink {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--md1-spacing-3, 24px);
  }

  .md1-docs-motion-ink-sheet {
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
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
    font: inherit;
    background: var(--md1-surface, #FFFFFF);
    border: 0;
    border-radius: var(--md1-radius, 2px);
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }

  /* The 48 dp touch target around a 24 dp glyph; the unbounded ink is the 48 dp circle. */
  .md1-docs-motion-ink-icon {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: var(--md1-touch-target, 48px);
    height: var(--md1-touch-target, 48px);
    margin: 0;
    padding: 0;
    color: var(--md1-icon-active, rgba(0, 0, 0, 0.54));
    background: transparent;
    border: 0;
    border-radius: 50%;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  .md1-docs-motion-ink-sheet:focus-visible,
  .md1-docs-motion-ink-icon:focus-visible {
    outline: 2px solid var(--md1-accent, #FF4081);
    outline-offset: 2px;
  }

  .md1-docs-motion-ink-label {
    position: relative;
  }
</style>
