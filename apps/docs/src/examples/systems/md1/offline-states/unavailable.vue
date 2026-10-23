<script setup lang="ts">
  import { createMd1IconsContext, Md1Button, Md1Icon } from '@paper/md1'
  import { shallowRef } from 'vue'

  // The pinned icon set has no cloud-off role yet, so this example registers
  // it for its own subtree, the way an app extends the set through
  // createMd1IconsPlugin({ icons }).
  const [, provideIcons] = createMd1IconsContext({
    icons: {
      // Material Icons file/cloud_off, filled, 24px, commit 49d4db35 (Apache License 2.0)
      'cloud-off': ['M19.35 10.04C18.67 6.59 15.64 4 12 4c-1.48 0-2.85.43-4.01 1.17l1.46 1.46C10.21 6.23 11.08 6 12 6c3.04 0 5.5 2.46 5.5 5.5v.5H19c1.66 0 3 1.34 3 3 0 1.13-.64 2.11-1.56 2.62l1.45 1.45C23.16 18.16 24 16.68 24 15c0-2.64-2.05-4.78-4.65-4.96zM3 5.27l2.75 2.74C2.56 8.15 0 10.77 0 14c0 3.31 2.69 6 6 6h11.73l2 2L21 20.73 4.27 4 3 5.27zM7.73 10l8 8H6c-2.21 0-4-1.79-4-4s1.79-4 4-4h1.73z'],
    },
  })

  provideIcons()

  const library = shallowRef(false)
</script>

<template>
  <div class="md1-docs-offline-empty">
    <span class="md1-docs-offline-badge">
      <Md1Icon class="md1-docs-offline-glyph" name="cloud-off" />

      No internet
    </span>

    <p class="md1-docs-offline-body">Search needs a connection. While you're offline you can still play anything you've downloaded.</p>

    <Md1Button @click="library = true">Go to downloads</Md1Button>

    <p v-if="library" class="md1-docs-offline-note" role="status">Showing downloads</p>
  </div>
</template>

<style>
  .md1-docs-offline-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--md1-spacing-2, 16px);
    box-sizing: border-box;
    max-width: 400px;
    padding: var(--md1-spacing-4, 32px) var(--md1-spacing-3, 24px);
    background: var(--md1-background, #FAFAFA);
    text-align: center;
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
  }

  .md1-docs-offline-badge {
    display: inline-flex;
    align-items: center;
    gap: var(--md1-spacing-1, 8px);
    font-size: var(--md1-type-subheading-size, 16px);
    line-height: var(--md1-type-subheading-leading, 24px);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }

  .md1-docs-offline-glyph {
    color: var(--md1-icon-active, rgba(0, 0, 0, 0.54));
  }

  .md1-docs-offline-body {
    margin: 0;
    font-size: var(--md1-type-body-1-size, 14px);
    line-height: var(--md1-type-body-1-leading, 20px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .md1-docs-offline-note {
    margin: 0;
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
