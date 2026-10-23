<script setup lang="ts">
  import { createQuantumIconsContext, QuButton, QuIcon } from '@paper/quantum'
  import { shallowRef } from 'vue'

  // The pinned icon set has no cloud-off role yet, so this example registers
  // it for its own subtree, the way an app extends the set through
  // createQuantumIconsPlugin({ icons }).
  const [, provideIcons] = createQuantumIconsContext({
    icons: {
      // Material Icons file/cloud_off, filled, 24px, commit 49d4db35 (Apache License 2.0)
      'cloud-off': ['M19.35 10.04C18.67 6.59 15.64 4 12 4c-1.48 0-2.85.43-4.01 1.17l1.46 1.46C10.21 6.23 11.08 6 12 6c3.04 0 5.5 2.46 5.5 5.5v.5H19c1.66 0 3 1.34 3 3 0 1.13-.64 2.11-1.56 2.62l1.45 1.45C23.16 18.16 24 16.68 24 15c0-2.64-2.05-4.78-4.65-4.96zM3 5.27l2.75 2.74C2.56 8.15 0 10.77 0 14c0 3.31 2.69 6 6 6h11.73l2 2L21 20.73 4.27 4 3 5.27zM7.73 10l8 8H6c-2.21 0-4-1.79-4-4s1.79-4 4-4h1.73z'],
    },
  })

  provideIcons()

  const library = shallowRef(false)
</script>

<template>
  <div class="quantum-docs-offline-empty">
    <span class="quantum-docs-offline-badge">
      <QuIcon class="quantum-docs-offline-glyph" name="cloud-off" />

      No internet
    </span>

    <p class="quantum-docs-offline-body">Search needs a connection. While you're offline you can still play anything you've downloaded.</p>

    <QuButton @click="library = true">Go to downloads</QuButton>

    <p v-if="library" class="quantum-docs-offline-note" role="status">Showing downloads</p>
  </div>
</template>

<style>
  .quantum-docs-offline-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--quantum-spacing-2, 16px);
    box-sizing: border-box;
    max-width: 400px;
    padding: var(--quantum-spacing-4, 32px) var(--quantum-spacing-3, 24px);
    background: var(--quantum-background, #FAFAFA);
    text-align: center;
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
  }

  .quantum-docs-offline-badge {
    display: inline-flex;
    align-items: center;
    gap: var(--quantum-spacing-1, 8px);
    font-size: var(--quantum-type-subheading-size, 16px);
    line-height: var(--quantum-type-subheading-leading, 24px);
    color: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
  }

  .quantum-docs-offline-glyph {
    color: var(--quantum-icon-active, rgba(0, 0, 0, 0.54));
  }

  .quantum-docs-offline-body {
    margin: 0;
    font-size: var(--quantum-type-body-1-size, 14px);
    line-height: var(--quantum-type-body-1-leading, 20px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .quantum-docs-offline-note {
    margin: 0;
    font-size: var(--quantum-type-caption-size, 12px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
