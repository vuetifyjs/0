<script setup lang="ts">
  import { spacing } from '@paper/quantum'

  const steps = Object.entries(spacing).map(([step, value]) => ({ step, value }))
</script>

<template>
  <div class="quantum-docs-layout-spacing">
    <div v-for="item in steps" :key="item.step" class="quantum-docs-layout-spacing-row">
      <span class="quantum-docs-layout-spacing-name quantum-type-caption">--quantum-spacing-{{ item.step }}</span>

      <span
        class="quantum-docs-layout-spacing-bar"
        :style="{ width: `var(--quantum-spacing-${item.step}, ${item.value})` }"
      />

      <span class="quantum-type-body-2">{{ item.value }}</span>
    </div>
  </div>
</template>

<style>
  /* The 8 dp square grid drawn behind the scale: every bar ends on a grid line. */
  .quantum-docs-layout-spacing {
    display: flex;
    flex-direction: column;
    gap: var(--quantum-spacing-1, 8px);
    padding: var(--quantum-spacing-2, 16px);
    color: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
    background-color: var(--quantum-surface, #FFFFFF);
    background-image:
      linear-gradient(to right, var(--quantum-divider, rgba(0, 0, 0, 0.12)) 1px, transparent 1px),
      linear-gradient(to bottom, var(--quantum-divider, rgba(0, 0, 0, 0.12)) 1px, transparent 1px);
    background-size: var(--quantum-spacing-1, 8px) var(--quantum-spacing-1, 8px);
  }

  .quantum-docs-layout-spacing-row {
    display: grid;
    grid-template-columns: 152px 40px auto;
    align-items: center;
    gap: var(--quantum-spacing-2, 16px);
    height: var(--quantum-spacing-3, 24px);
  }

  .quantum-docs-layout-spacing-name {
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .quantum-docs-layout-spacing-bar {
    height: var(--quantum-spacing-2, 16px);
    background: var(--quantum-primary, #3F51B5);
  }
</style>
