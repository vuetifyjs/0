<script setup lang="ts">
  import { EmButton, EmIcon } from '@paper/emerald'
</script>

<template>
  <div class="emerald-docs-row">
    <!-- Decorative: the text beside it already names the action. -->
    <EmButton variant="secondary">
      <EmIcon name="envelope" size="s" />
      Email receipt
    </EmButton>

    <!-- Labelled: the icon is the entire message, so it carries the name. -->
    <span class="emerald-docs-status">
      <EmIcon label="Sync failed" name="info" />
    </span>

    <!-- Named on the control, not the glyph: the button is what gets activated. -->
    <EmButton aria-label="Dismiss notification" variant="tertiary">
      <EmIcon name="close" size="s" />
    </EmButton>
  </div>
</template>

<style>
  .emerald-docs-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--emerald-spacing-m, 16px);
  }

  .emerald-docs-status {
    display: inline-flex;
    color: var(--emerald-danger-400);
  }
</style>
