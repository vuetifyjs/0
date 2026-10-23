<script setup lang="ts">
  import { Md1Icon } from '@paper/md1'

  const tiers = [
    { tier: 'focused', token: '--md1-icon-focused' },
    { tier: 'active', token: '--md1-icon-active' },
    { tier: 'inactive', token: '--md1-icon-inactive' },
  ]
</script>

<template>
  <div class="md1-docs-row">
    <figure
      v-for="entry in tiers"
      :key="entry.tier"
      class="md1-docs-icon-tier"
      :data-tier="entry.tier"
    >
      <Md1Icon name="notifications" />

      <figcaption class="md1-docs-icon-legend">
        <span>{{ entry.tier }}</span>

        <span>{{ entry.token }}</span>
      </figcaption>
    </figure>
  </div>
</template>

<style>
  .md1-docs-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--md1-spacing-1, 8px);
  }

  .md1-docs-icon-tier {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--md1-spacing-1, 8px);
    margin: 0;
    padding: var(--md1-spacing-2, 16px);
  }

  /* The glyph draws in currentColor; the host picks the tier. */
  .md1-docs-icon-tier[data-tier='focused'] {
    color: var(--md1-icon-focused, rgba(0, 0, 0, 0.87));
  }

  .md1-docs-icon-tier[data-tier='active'] {
    color: var(--md1-icon-active, rgba(0, 0, 0, 0.54));
  }

  .md1-docs-icon-tier[data-tier='inactive'] {
    color: var(--md1-icon-inactive, rgba(0, 0, 0, 0.38));
  }

  .md1-docs-icon-legend {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
