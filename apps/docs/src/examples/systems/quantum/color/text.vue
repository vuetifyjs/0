<script setup lang="ts">
  import { QuIcon } from '@paper/quantum'

  // The colour page's opacity tables: black ink on light, white ink on dark.
  const THEMES = [
    { id: 'quantum-light', name: 'Black on light', primary: '87%', secondary: '54%', disabled: '38%', divider: '12%', active: '54%', inactive: '38%' },
    { id: 'quantum-dark', name: 'White on dark', primary: '100%', secondary: '70%', disabled: '50%', divider: '12%', active: '100%', inactive: '50%' },
  ] as const
</script>

<template>
  <div class="quantum-docs-inks">
    <div
      v-for="theme in THEMES"
      :key="theme.id"
      class="quantum-docs-inks-panel"
      :data-theme="theme.id"
    >
      <p class="quantum-docs-inks-name quantum-type-caption">{{ theme.name }}</p>

      <p class="quantum-docs-inks-line quantum-docs-inks-primary quantum-type-subheading">Primary text {{ theme.primary }}</p>

      <p class="quantum-docs-inks-line quantum-docs-inks-secondary quantum-type-subheading">Secondary text {{ theme.secondary }}</p>

      <p class="quantum-docs-inks-line quantum-docs-inks-disabled quantum-type-subheading">Disabled and hint text {{ theme.disabled }}</p>

      <div class="quantum-docs-inks-divider" />

      <p class="quantum-docs-inks-line quantum-docs-inks-secondary quantum-type-caption">Divider {{ theme.divider }}</p>

      <div class="quantum-docs-inks-icons">
        <span class="quantum-docs-inks-icon quantum-docs-inks-active">
          <QuIcon name="favorite" />

          <span class="quantum-type-caption">Active {{ theme.active }}</span>
        </span>

        <span class="quantum-docs-inks-icon quantum-docs-inks-inactive">
          <QuIcon name="favorite" />

          <span class="quantum-type-caption">Inactive {{ theme.inactive }}</span>
        </span>
      </div>
    </div>
  </div>
</template>

<style>
  .quantum-docs-inks {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: var(--quantum-spacing-2, 16px);
  }

  .quantum-docs-inks-panel {
    display: flex;
    flex-direction: column;
    gap: var(--quantum-spacing-1, 8px);
    padding: var(--quantum-spacing-2, 16px);
    background: var(--quantum-surface, #FFFFFF);
    border: 1px solid var(--quantum-divider, rgba(0, 0, 0, 0.12));
  }

  .quantum-docs-inks-name,
  .quantum-docs-inks-line {
    margin: 0;
  }

  /* The type utilities carry each style's own ink; these rules restate the tier being shown. */
  .quantum-docs-inks-primary {
    color: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
  }

  .quantum-docs-inks-secondary {
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .quantum-docs-inks-disabled {
    color: var(--quantum-text-disabled, rgba(0, 0, 0, 0.38));
  }

  .quantum-docs-inks-divider {
    height: 1px;
    background: var(--quantum-divider, rgba(0, 0, 0, 0.12));
  }

  .quantum-docs-inks-icons {
    display: flex;
    gap: var(--quantum-spacing-3, 24px);
  }

  .quantum-docs-inks-icon {
    display: inline-flex;
    align-items: center;
    gap: var(--quantum-spacing-1, 8px);
  }

  .quantum-docs-inks-active {
    color: var(--quantum-icon-active, rgba(0, 0, 0, 0.54));
  }

  .quantum-docs-inks-inactive {
    color: var(--quantum-icon-inactive, rgba(0, 0, 0, 0.38));
  }
</style>
