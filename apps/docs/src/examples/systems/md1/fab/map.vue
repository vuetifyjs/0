<script setup lang="ts">
  import { Md1Fab } from '@paper/md1'
  import { shallowRef } from 'vue'

  const offset = shallowRef({ x: 0, y: 0 })
  const centred = shallowRef(true)
  const route = shallowRef(false)

  function onPan () {
    offset.value = { x: offset.value.x - 40, y: offset.value.y + 24 }
    centred.value = false
  }

  function onRecenter () {
    offset.value = { x: 0, y: 0 }
    centred.value = true
  }
</script>

<template>
  <div class="md1-docs-screen md1-docs-fab-map">
    <button
      aria-label="Pan the map"
      class="md1-docs-fab-map-surface"
      :style="{ backgroundPosition: `${offset.x}px ${offset.y}px` }"
      type="button"
      @click="onPan"
    />

    <span class="md1-docs-fab-map-note" role="status">{{ route ? 'Route to Dandelion Chocolate' : centred ? 'Centred on your location' : 'Map moved. Press the location button to recentre.' }}</span>

    <Md1Fab
      aria-label="Recentre on your location"
      class="md1-docs-fab-map-recenter"
      icon="near-me"
      mini
      @click="onRecenter"
    />

    <Md1Fab aria-label="Directions" icon="place" @click="route = !route" />
  </div>
</template>

<style>
  .md1-docs-fab-map {
    background: var(--md1-background, #FAFAFA);
  }

  /* A stand-in map that pans when pressed and slides back when recentred. */
  .md1-docs-fab-map-surface {
    position: absolute;
    inset: 0;
    margin: 0;
    padding: 0;
    border: 0;
    background-color: var(--md1-background, #FAFAFA);
    background-image:
      linear-gradient(var(--md1-divider, rgba(0, 0, 0, 0.12)) 2px, transparent 2px),
      linear-gradient(90deg, var(--md1-divider, rgba(0, 0, 0, 0.12)) 2px, transparent 2px);
    background-size: 64px 64px;
    cursor: grab;
    transition: background-position var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .md1-docs-fab-map-note {
    position: absolute;
    inset: var(--md1-spacing-2, 16px) var(--md1-spacing-2, 16px) auto;
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-body-1-size, 14px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
    pointer-events: none;
  }

  /* The mini FAB sits on the main FAB's column, 16 dp above it: centred over the 56 dp button. */
  .md1-docs-fab-map .md1-docs-fab-map-recenter {
    inset-block-end: calc(var(--md1-keyline-margin, 16px) + 56px + var(--md1-keyline-margin, 16px));
    inset-inline-end: calc(var(--md1-keyline-margin, 16px) + 8px);
  }

  /* Under 460 px every FAB is the 40 dp size, so the two share one column edge. */
  @media (max-width: 460px) {
    .md1-docs-fab-map .md1-docs-fab-map-recenter {
      inset-block-end: calc(var(--md1-keyline-margin, 16px) + 40px + var(--md1-keyline-margin, 16px));
      inset-inline-end: var(--md1-keyline-margin, 16px);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .md1-docs-fab-map-surface {
      transition: none;
    }
  }
</style>
