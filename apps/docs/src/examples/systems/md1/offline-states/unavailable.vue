<script setup lang="ts">
  import { Md1Button, Md1Icon } from '@paper/md1'
  import { shallowRef } from 'vue'

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
