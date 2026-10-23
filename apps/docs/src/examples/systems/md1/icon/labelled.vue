<script setup lang="ts">
  import { Md1Icon } from '@paper/md1'
</script>

<template>
  <div class="md1-docs-stack">
    <div class="md1-docs-row">
      <Md1Icon class="md1-docs-icon-ink" name="folder" />

      <span class="md1-docs-icon-text">Projects</span>
    </div>

    <div class="md1-docs-row">
      <span class="md1-docs-icon-text">Camera backup</span>

      <Md1Icon class="md1-docs-icon-ink" label="Synced" name="check-circle" />
    </div>

    <div class="md1-docs-row">
      <span class="md1-docs-icon-text">Documents backup</span>

      <Md1Icon class="md1-docs-icon-error" label="Sync failed" name="error" />
    </div>
  </div>
</template>

<style>
  .md1-docs-stack {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--md1-spacing-2, 16px);
  }

  .md1-docs-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--md1-spacing-1, 8px);
  }

  .md1-docs-icon-ink {
    color: var(--md1-icon-active, rgba(0, 0, 0, 0.54));
  }

  .md1-docs-icon-error {
    color: var(--md1-error, #FF1744);
  }

  .md1-docs-icon-text {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-body-1-size, 14px);
    line-height: var(--md1-type-body-1-leading, 20px);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }
</style>
