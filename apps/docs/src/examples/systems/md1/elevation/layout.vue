<script setup lang="ts">
  import { Md1Card, Md1Fab, Md1Toolbar } from '@paper/md1'

  // The cross-section: each surface at its resting elevation, 16 px per dp,
  // in the order the screen stacks them.
  const LAYERS = [
    { name: 'Floating action button', dp: 6, width: 18 },
    { name: 'App bar', dp: 4, width: 100 },
    { name: 'Cards', dp: 2, width: 90 },
    { name: 'Background', dp: 0, width: 100 },
  ] as const
</script>

<template>
  <div class="md1-docs-elevation-layout">
    <figure class="md1-docs-elevation-layout-figure">
      <div class="md1-docs-elevation-layout-screen">
        <Md1Toolbar class="md1-docs-elevation-layout-bar">
          <Md1Toolbar.Nav />

          <Md1Toolbar.Title>Trips</Md1Toolbar.Title>
        </Md1Toolbar>

        <div class="md1-docs-elevation-layout-content">
          <Md1Card>
            <Md1Card.Title>Lisbon</Md1Card.Title>

            <Md1Card.Subtitle>3 nights from Friday</Md1Card.Subtitle>
          </Md1Card>

          <Md1Card>
            <Md1Card.Title>Porto</Md1Card.Title>

            <Md1Card.Subtitle>A weekend in May</Md1Card.Subtitle>
          </Md1Card>
        </div>

        <Md1Fab aria-label="Add trip" icon="add" />
      </div>

      <figcaption class="md1-docs-note">The screen</figcaption>
    </figure>

    <figure class="md1-docs-elevation-layout-figure">
      <div aria-label="Cross-section: background at 0 dp, cards at 2 dp, app bar at 4 dp, floating action button at 6 dp" class="md1-docs-elevation-section" role="img">
        <div
          v-for="layer in LAYERS"
          :key="layer.name"
          class="md1-docs-elevation-section-layer"
          :style="{ '--dp': layer.dp, '--width': `${layer.width}%` }"
        >
          <span class="md1-docs-elevation-section-sheet" />

          <span class="md1-docs-elevation-section-label">{{ layer.name }}, {{ layer.dp }} dp</span>
        </div>
      </div>

      <figcaption class="md1-docs-note">Its cross-section on the z axis, 16 px per dp</figcaption>
    </figure>
  </div>
</template>

<style>
  .md1-docs-elevation-layout {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: center;
    gap: var(--md1-spacing-3, 24px) var(--md1-spacing-5, 40px);
  }

  .md1-docs-elevation-layout-figure {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--md1-spacing-1, 8px);
    margin: 0;
  }

  /* A handset screen; containment makes it the fixed FAB's containing block. */
  .md1-docs-elevation-layout-screen {
    position: relative;
    width: min(300px, 80vw);
    height: 360px;
    overflow: clip;
    contain: layout paint;
    background: var(--md1-background, #FAFAFA);
    box-shadow: inset 0 0 0 1px var(--md1-divider, rgba(0, 0, 0, 0.12));
  }

  .md1-docs-elevation-layout-bar {
    position: relative;
    z-index: 1;
  }

  .md1-docs-elevation-layout-content {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-1, 8px);
    padding: var(--md1-spacing-1, 8px);
  }

  /* The side view: each sheet a 1 dp line raised by its elevation. */
  .md1-docs-elevation-section {
    position: relative;
    width: min(300px, 80vw);
    height: 120px;
    border-bottom: 1px solid var(--md1-divider, rgba(0, 0, 0, 0.12));
  }

  .md1-docs-elevation-section-layer {
    position: absolute;
    inset-inline: 0;
    bottom: calc(var(--dp) * 16px);
  }

  .md1-docs-elevation-section-sheet {
    display: block;
    width: var(--width);
    height: 4px;
    margin-inline-start: auto;
    background: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .md1-docs-elevation-section-label {
    position: absolute;
    bottom: 6px;
    inset-inline-start: 0;
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: 11px;
    line-height: 14px;
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
    white-space: nowrap;
  }

  .md1-docs-note {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
