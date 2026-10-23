<script setup lang="ts">
  import { QuButton } from '@paper/quantum'
</script>

<template>
  <div class="quantum-docs-errors-stack">
    <QuButton aria-describedby="quantum-docs-errors-export" disabled variant="raised">Export report</QuButton>

    <p id="quantum-docs-errors-export" class="quantum-docs-errors-caption">Export is available once the report finishes processing, in about 5 minutes.</p>
  </div>
</template>

<style>
  .quantum-docs-errors-stack {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--quantum-spacing-1, 8px);
  }

  .quantum-docs-errors-caption {
    margin: 0;
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-caption-size, 12px);
    letter-spacing: var(--quantum-type-caption-tracking, 0.02em);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
