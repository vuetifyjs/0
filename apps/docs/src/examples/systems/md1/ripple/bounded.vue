<script setup lang="ts">
  import { Md1Icon, Md1Ripple } from '@paper/md1'
  import { Button } from '@vuetify/v0'
</script>

<template>
  <div class="md1-docs-ripple-compare">
    <div class="md1-docs-ripple-stack">
      <Button.Root class="md1-docs-ripple-tile md1-elevation-2">
        <Md1Ripple />

        <Md1Icon class="md1-docs-ripple-tile-icon" name="inbox" />

        <span class="md1-docs-ripple-label md1-type-subheading">Inbox</span>
      </Button.Root>

      <span class="md1-docs-ripple-note">Bounded: clipped to the tile</span>
    </div>

    <div class="md1-docs-ripple-stack">
      <Button.Root aria-label="Like" class="md1-docs-ripple-glyph-host">
        <Md1Ripple unbounded />

        <Md1Icon class="md1-docs-ripple-label" name="thumb-up" />
      </Button.Root>

      <span class="md1-docs-ripple-note">Unbounded: a 48 dp circle</span>
    </div>
  </div>
</template>

<style>
  .md1-docs-ripple-compare {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: var(--md1-spacing-4, 32px);
  }

  .md1-docs-ripple-stack {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--md1-spacing-1, 8px);
  }

  .md1-docs-ripple-tile {
    position: relative;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 240px;
    max-width: 100%;
    height: 48px;
    margin: 0;
    padding-inline: var(--md1-keyline-margin, 16px);
    border: 0;
    border-radius: var(--md1-radius, 2px);
    background: var(--md1-surface, #FFFFFF);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
    font: inherit;
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }

  .md1-docs-ripple-tile-icon {
    position: relative;
    margin-inline-end: var(--md1-spacing-4, 32px);
    color: var(--md1-icon-active, rgba(0, 0, 0, 0.54));
  }

  /* A 24 dp glyph whose touch target and ink both extend to 48 dp around it. */
  .md1-docs-ripple-glyph-host {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    margin: 12px;
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: none;
    color: var(--md1-icon-active, rgba(0, 0, 0, 0.54));
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  .md1-docs-ripple-glyph-host::before {
    position: absolute;
    inset: -12px;
    content: '';
  }

  .md1-docs-ripple-tile:focus-visible,
  .md1-docs-ripple-glyph-host:focus-visible {
    outline: 2px solid var(--md1-accent, #FF4081);
    outline-offset: 2px;
  }

  .md1-docs-ripple-label {
    position: relative;
  }

  .md1-docs-ripple-note {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
