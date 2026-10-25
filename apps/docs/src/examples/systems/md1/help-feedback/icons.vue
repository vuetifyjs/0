<script setup lang="ts">
  import { Md1Icon } from '@paper/md1'
</script>

<template>
  <ul class="md1-docs-help-icons">
    <li class="md1-docs-help-icon">
      <Md1Icon name="help" />

      <span class="md1-docs-help-icon-label">Help, 24 dp</span>
    </li>

    <li class="md1-docs-help-icon">
      <Md1Icon name="feedback" />

      <span class="md1-docs-help-icon-label">Send feedback, 24 dp</span>
    </li>

    <li class="md1-docs-help-icon">
      <Md1Icon class="md1-docs-help-icon-small" name="help-outline" />

      <span class="md1-docs-help-icon-label">Help tooltip, 18 dp</span>
    </li>
  </ul>
</template>

<style>
  .md1-docs-help-icons {
    display: flex;
    flex-wrap: wrap;
    gap: var(--md1-spacing-3, 24px);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  /* Each glyph on a 72 dp tile at the active icon ink, with its role and size under it. */
  .md1-docs-help-icon {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--md1-spacing-1, 8px);
    width: 120px;
    padding: var(--md1-spacing-3, 24px) 0 var(--md1-spacing-2, 16px);
    color: var(--md1-icon-active, rgba(0, 0, 0, 0.54));
    background: var(--md1-surface, #FFFFFF);
    box-shadow: var(--md1-elevation-1);
  }

  .md1-docs-help-icon-small {
    --md1-icon-size: 18px;
  }

  .md1-docs-help-icon-label {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
