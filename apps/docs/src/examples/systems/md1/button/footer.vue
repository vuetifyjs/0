<script setup lang="ts">
  import { Md1Button } from '@paper/md1'

  import { shallowRef } from 'vue'

  const seen = shallowRef(false)
</script>

<template>
  <div class="md1-docs-stack">
    <div class="md1-docs-sheet md1-elevation-2">
      <p class="md1-docs-sheet-title md1-type-title">Storage almost full</p>

      <p class="md1-docs-sheet-text md1-type-body-1">
        Photos and videos are no longer backing up. Free up space or buy more storage to continue.
      </p>

      <div class="md1-docs-sheet-divider" />

      <Md1Button footer @click="seen = true">Got it</Md1Button>
    </div>

    <span v-if="seen" class="md1-docs-note" role="status">Dismissed</span>
  </div>
</template>

<style>
  .md1-docs-stack {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--md1-spacing-2, 16px);
  }

  /* A dialog-like sheet: the surface colour with the 2 dp radius; its depth is the shipped md1-elevation-2 utility. The footer button closes it. */
  .md1-docs-sheet {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 320px;
    overflow: clip;
    background: var(--md1-surface, #FFFFFF);
    border-radius: var(--md1-radius, 2px);
  }

  .md1-docs-sheet-title {
    margin: 0;
    padding: var(--md1-spacing-3, 24px) var(--md1-spacing-3, 24px) 0;
  }

  .md1-docs-sheet-text {
    margin: 0;
    padding: 20px var(--md1-spacing-3, 24px) var(--md1-spacing-3, 24px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  /* The divider the guidelines add above a footer button; Md1Divider replaces this rule when it lands. */
  .md1-docs-sheet-divider {
    height: 1px;
    background: var(--md1-divider, rgba(0, 0, 0, 0.12));
  }

  .md1-docs-note {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
