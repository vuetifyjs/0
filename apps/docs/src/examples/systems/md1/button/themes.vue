<script setup lang="ts">
  import { Md1Button } from '@paper/md1'

  const themes = [
    { id: 'md1-light', name: 'Light theme' },
    { id: 'md1-dark', name: 'Dark theme' },
  ]
</script>

<template>
  <div class="md1-docs-button-themes">
    <div
      v-for="theme in themes"
      :key="theme.id"
      class="md1-docs-button-theme"
      :data-theme="theme.id"
    >
      <span class="md1-docs-button-theme-name md1-type-body-2">{{ theme.name }}</span>

      <div class="md1-docs-button-theme-grid">
        <Md1Button>Flat</Md1Button>

        <Md1Button disabled>Flat</Md1Button>

        <Md1Button variant="raised">Raised</Md1Button>

        <Md1Button disabled variant="raised">Raised</Md1Button>
      </div>
    </div>
  </div>
</template>

<style>
  .md1-docs-button-themes {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    width: 100%;
  }

  /* Each half paints its theme's background, #FAFAFA or #303030, so the buttons sit on the canvas the dark figure draws. */
  .md1-docs-button-theme {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-2, 16px);
    padding: var(--md1-spacing-2, 16px) var(--md1-spacing-2, 16px) var(--md1-spacing-3, 24px);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
    background: var(--md1-background, #FAFAFA);
  }

  .md1-docs-button-theme-name {
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  /* Enabled beside disabled, flat above raised. */
  .md1-docs-button-theme-grid {
    display: grid;
    grid-template-columns: repeat(2, max-content);
    gap: var(--md1-spacing-2, 16px);
  }
</style>
