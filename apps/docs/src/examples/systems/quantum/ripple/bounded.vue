<script setup lang="ts">
  import { QuIcon, QuRipple } from '@paper/quantum'
  import { Button } from '@vuetify/v0'
</script>

<template>
  <div class="quantum-docs-ripple-compare">
    <div class="quantum-docs-ripple-stack">
      <Button.Root class="quantum-docs-ripple-tile quantum-elevation-2">
        <QuRipple />

        <QuIcon class="quantum-docs-ripple-tile-icon" name="inbox" />

        <span class="quantum-docs-ripple-label quantum-type-subheading">Inbox</span>
      </Button.Root>

      <span class="quantum-docs-ripple-note">Bounded: clipped to the tile</span>
    </div>

    <div class="quantum-docs-ripple-stack">
      <Button.Root aria-label="Like" class="quantum-docs-ripple-glyph-host">
        <QuRipple unbounded />

        <QuIcon class="quantum-docs-ripple-label" name="thumb-up" />
      </Button.Root>

      <span class="quantum-docs-ripple-note">Unbounded: a 48 dp circle</span>
    </div>
  </div>
</template>

<style>
  .quantum-docs-ripple-compare {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: var(--quantum-spacing-4, 32px);
  }

  .quantum-docs-ripple-stack {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--quantum-spacing-1, 8px);
  }

  .quantum-docs-ripple-tile {
    position: relative;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 240px;
    max-width: 100%;
    height: 48px;
    margin: 0;
    padding-inline: var(--quantum-keyline-margin, 16px);
    border: 0;
    border-radius: var(--quantum-radius, 2px);
    background: var(--quantum-surface, #FFFFFF);
    color: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
    font: inherit;
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }

  .quantum-docs-ripple-tile-icon {
    position: relative;
    margin-inline-end: var(--quantum-spacing-4, 32px);
    color: var(--quantum-icon-active, rgba(0, 0, 0, 0.54));
  }

  /* A 24 dp glyph whose touch target and ink both extend to 48 dp around it. */
  .quantum-docs-ripple-glyph-host {
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
    color: var(--quantum-icon-active, rgba(0, 0, 0, 0.54));
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  .quantum-docs-ripple-glyph-host::before {
    position: absolute;
    inset: -12px;
    content: '';
  }

  .quantum-docs-ripple-tile:focus-visible,
  .quantum-docs-ripple-glyph-host:focus-visible {
    outline: 2px solid var(--quantum-accent, #FF4081);
    outline-offset: 2px;
  }

  .quantum-docs-ripple-label {
    position: relative;
  }

  .quantum-docs-ripple-note {
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-caption-size, 12px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
