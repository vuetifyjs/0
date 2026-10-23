<script setup lang="ts">
  import { Md1Button } from '@paper/md1'
</script>

<template>
  <div class="md1-docs-errors-stack">
    <Md1Button aria-describedby="md1-docs-errors-export" disabled variant="raised">Export report</Md1Button>

    <p id="md1-docs-errors-export" class="md1-docs-errors-caption">Export is available once the report finishes processing, in about 5 minutes.</p>
  </div>
</template>

<style>
  .md1-docs-errors-stack {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--md1-spacing-1, 8px);
  }

  /* The explanation sits centred under the button it explains, so a wrapped line stays with it on a narrow screen. */
  .md1-docs-errors-caption {
    max-width: 360px;
    margin: 0;
    text-align: center;
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    letter-spacing: var(--md1-type-caption-tracking, 0.02em);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
