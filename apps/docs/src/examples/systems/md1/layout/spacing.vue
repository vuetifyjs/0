<script setup lang="ts">
  import { spacing } from '@paper/md1'

  const steps = Object.entries(spacing).map(([step, value]) => ({ step, value }))
</script>

<template>
  <div class="md1-docs-layout-spacing">
    <div v-for="item in steps" :key="item.step" class="md1-docs-layout-spacing-row">
      <span class="md1-docs-layout-spacing-name md1-type-caption">--md1-spacing-{{ item.step }}</span>

      <span
        class="md1-docs-layout-spacing-bar"
        :style="{ width: `var(--md1-spacing-${item.step}, ${item.value})` }"
      />

      <span class="md1-type-body-2">{{ item.value }}</span>
    </div>
  </div>
</template>

<style>
  /* The 8 dp square grid drawn behind the scale: every bar ends on a grid line. */
  .md1-docs-layout-spacing {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-1, 8px);
    padding: var(--md1-spacing-2, 16px);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
    background-color: var(--md1-surface, #FFFFFF);
    background-image:
      linear-gradient(to right, var(--md1-divider, rgba(0, 0, 0, 0.12)) 1px, transparent 1px),
      linear-gradient(to bottom, var(--md1-divider, rgba(0, 0, 0, 0.12)) 1px, transparent 1px);
    background-size: var(--md1-spacing-1, 8px) var(--md1-spacing-1, 8px);
  }

  .md1-docs-layout-spacing-row {
    display: grid;
    grid-template-columns: 152px 40px auto;
    align-items: center;
    gap: var(--md1-spacing-2, 16px);
    height: var(--md1-spacing-3, 24px);
  }

  .md1-docs-layout-spacing-name {
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .md1-docs-layout-spacing-bar {
    height: var(--md1-spacing-2, 16px);
    background: var(--md1-primary, #3F51B5);
  }
</style>
