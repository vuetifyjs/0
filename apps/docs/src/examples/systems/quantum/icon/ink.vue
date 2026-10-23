<script setup lang="ts">
  import { QuIcon } from '@paper/quantum'

  const tiers = [
    { tier: 'focused', token: '--quantum-icon-focused' },
    { tier: 'active', token: '--quantum-icon-active' },
    { tier: 'inactive', token: '--quantum-icon-inactive' },
  ]
</script>

<template>
  <div class="quantum-docs-row">
    <figure
      v-for="entry in tiers"
      :key="entry.tier"
      class="quantum-docs-icon-tier"
      :data-tier="entry.tier"
    >
      <QuIcon name="notifications" />

      <figcaption class="quantum-docs-icon-legend">
        <span>{{ entry.tier }}</span>

        <span>{{ entry.token }}</span>
      </figcaption>
    </figure>
  </div>
</template>

<style>
  .quantum-docs-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--quantum-spacing-1, 8px);
  }

  .quantum-docs-icon-tier {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--quantum-spacing-1, 8px);
    margin: 0;
    padding: var(--quantum-spacing-2, 16px);
  }

  /* The glyph draws in currentColor; the host picks the tier. */
  .quantum-docs-icon-tier[data-tier='focused'] {
    color: var(--quantum-icon-focused, rgba(0, 0, 0, 0.87));
  }

  .quantum-docs-icon-tier[data-tier='active'] {
    color: var(--quantum-icon-active, rgba(0, 0, 0, 0.54));
  }

  .quantum-docs-icon-tier[data-tier='inactive'] {
    color: var(--quantum-icon-inactive, rgba(0, 0, 0, 0.38));
  }

  .quantum-docs-icon-legend {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-caption-size, 12px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
