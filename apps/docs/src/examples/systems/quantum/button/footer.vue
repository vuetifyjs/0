<script setup lang="ts">
  import { QuButton } from '@paper/quantum'

  import { shallowRef } from 'vue'

  const seen = shallowRef(false)
</script>

<template>
  <div class="quantum-docs-stack">
    <div class="quantum-docs-sheet quantum-elevation-2">
      <p class="quantum-docs-sheet-title quantum-type-title">Storage almost full</p>

      <p class="quantum-docs-sheet-text quantum-type-body-1">
        Photos and videos are no longer backing up. Free up space or buy more storage to continue.
      </p>

      <div class="quantum-docs-sheet-divider" />

      <QuButton footer @click="seen = true">Got it</QuButton>
    </div>

    <span v-if="seen" class="quantum-docs-note" role="status">Dismissed</span>
  </div>
</template>

<style>
  .quantum-docs-stack {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--quantum-spacing-2, 16px);
  }

  /* A dialog-like sheet: the surface colour with the 2 dp radius; its depth is the shipped quantum-elevation-2 utility. The footer button closes it. */
  .quantum-docs-sheet {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 320px;
    overflow: clip;
    background: var(--quantum-surface, #FFFFFF);
    border-radius: var(--quantum-radius, 2px);
  }

  .quantum-docs-sheet-title {
    margin: 0;
    padding: var(--quantum-spacing-3, 24px) var(--quantum-spacing-3, 24px) 0;
  }

  .quantum-docs-sheet-text {
    margin: 0;
    padding: 20px var(--quantum-spacing-3, 24px) var(--quantum-spacing-3, 24px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }

  /* The divider the guidelines add above a footer button; QuDivider replaces this rule when it lands. */
  .quantum-docs-sheet-divider {
    height: 1px;
    background: var(--quantum-divider, rgba(0, 0, 0, 0.12));
  }

  .quantum-docs-note {
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-caption-size, 12px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
