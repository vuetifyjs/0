<script setup lang="ts">
  import { QuIcon } from '@paper/quantum'
</script>

<template>
  <div class="quantum-docs-stack">
    <div class="quantum-docs-row">
      <QuIcon class="quantum-docs-icon-ink" name="folder" />

      <span class="quantum-docs-icon-text">Projects</span>
    </div>

    <div class="quantum-docs-row">
      <span class="quantum-docs-icon-text">Camera backup</span>

      <QuIcon class="quantum-docs-icon-ink" label="Synced" name="check-circle" />
    </div>

    <div class="quantum-docs-row">
      <span class="quantum-docs-icon-text">Documents backup</span>

      <QuIcon class="quantum-docs-icon-error" label="Sync failed" name="error" />
    </div>
  </div>
</template>

<style>
  .quantum-docs-stack {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--quantum-spacing-2, 16px);
  }

  .quantum-docs-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--quantum-spacing-1, 8px);
  }

  .quantum-docs-icon-ink {
    color: var(--quantum-icon-active, rgba(0, 0, 0, 0.54));
  }

  .quantum-docs-icon-error {
    color: var(--quantum-error, #FF1744);
  }

  .quantum-docs-icon-text {
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-body-1-size, 14px);
    line-height: var(--quantum-type-body-1-leading, 20px);
    color: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
  }
</style>
