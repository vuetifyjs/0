<script setup lang="ts">
  import { Md1Icon } from '@paper/md1'

  // The colour page's opacity tables: black ink on light, white ink on dark.
  const THEMES = [
    { id: 'md1-light', name: 'Black on light', primary: '87%', secondary: '54%', disabled: '38%', divider: '12%', active: '54%', inactive: '38%' },
    { id: 'md1-dark', name: 'White on dark', primary: '100%', secondary: '70%', disabled: '50%', divider: '12%', active: '100%', inactive: '50%' },
  ] as const
</script>

<template>
  <div class="md1-docs-inks">
    <div
      v-for="theme in THEMES"
      :key="theme.id"
      class="md1-docs-inks-panel"
      :data-theme="theme.id"
    >
      <p class="md1-docs-inks-name md1-type-caption">{{ theme.name }}</p>

      <p class="md1-docs-inks-line md1-docs-inks-primary md1-type-subheading">Primary text {{ theme.primary }}</p>

      <p class="md1-docs-inks-line md1-docs-inks-secondary md1-type-subheading">Secondary text {{ theme.secondary }}</p>

      <p class="md1-docs-inks-line md1-docs-inks-disabled md1-type-subheading">Disabled and hint text {{ theme.disabled }}</p>

      <div class="md1-docs-inks-divider" />

      <p class="md1-docs-inks-line md1-docs-inks-secondary md1-type-caption">Divider {{ theme.divider }}</p>

      <div class="md1-docs-inks-icons">
        <span class="md1-docs-inks-icon md1-docs-inks-active">
          <Md1Icon name="favorite" />

          <span class="md1-type-caption">Active {{ theme.active }}</span>
        </span>

        <span class="md1-docs-inks-icon md1-docs-inks-inactive">
          <Md1Icon name="favorite" />

          <span class="md1-type-caption">Inactive {{ theme.inactive }}</span>
        </span>
      </div>
    </div>
  </div>
</template>

<style>
  .md1-docs-inks {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: var(--md1-spacing-2, 16px);
  }

  .md1-docs-inks-panel {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-1, 8px);
    padding: var(--md1-spacing-2, 16px);
    background: var(--md1-surface, #FFFFFF);
    border: 1px solid var(--md1-divider, rgba(0, 0, 0, 0.12));
  }

  .md1-docs-inks-name,
  .md1-docs-inks-line {
    margin: 0;
  }

  /* The type utilities carry each style's own ink; these rules restate the tier being shown. */
  .md1-docs-inks-primary {
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }

  .md1-docs-inks-secondary {
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .md1-docs-inks-disabled {
    color: var(--md1-text-disabled, rgba(0, 0, 0, 0.38));
  }

  .md1-docs-inks-divider {
    height: 1px;
    background: var(--md1-divider, rgba(0, 0, 0, 0.12));
  }

  .md1-docs-inks-icons {
    display: flex;
    gap: var(--md1-spacing-3, 24px);
  }

  .md1-docs-inks-icon {
    display: inline-flex;
    align-items: center;
    gap: var(--md1-spacing-1, 8px);
  }

  .md1-docs-inks-active {
    color: var(--md1-icon-active, rgba(0, 0, 0, 0.54));
  }

  .md1-docs-inks-inactive {
    color: var(--md1-icon-inactive, rgba(0, 0, 0, 0.38));
  }
</style>
