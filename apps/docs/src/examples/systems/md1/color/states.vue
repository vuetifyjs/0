<script setup lang="ts">
  // The state overlays each theme publishes, painted over the theme's sheet.
  const STATES = [
    { token: 'hover', name: 'Box fill and halo', light: 'black 6%', dark: 'white 10%' },
    { token: 'list-hover', name: 'List hover', light: 'black 4%', dark: 'white 8%' },
    { token: 'focus', name: 'Focus', light: 'black 12%', dark: 'white 12%' },
    { token: 'pressed', name: 'Pressed', light: '#999999 40%', dark: '#CCCCCC 25%' },
    { token: 'selection', name: 'Selection', light: 'accent 30%', dark: 'accent 30%' },
    { token: 'button-disabled', name: 'Disabled fill', light: 'black 12%', dark: 'white 12%' },
  ] as const

  const THEMES = [
    { id: 'md1-light', name: 'Light theme', key: 'light' },
    { id: 'md1-dark', name: 'Dark theme', key: 'dark' },
  ] as const
</script>

<template>
  <div class="md1-docs-states">
    <div
      v-for="theme in THEMES"
      :key="theme.id"
      class="md1-docs-states-panel"
      :data-theme="theme.id"
    >
      <p class="md1-docs-states-name md1-type-caption">{{ theme.name }}</p>

      <div class="md1-docs-states-grid">
        <div v-for="state in STATES" :key="state.token" class="md1-docs-state">
          <div class="md1-docs-state-fill" :style="{ background: `var(--md1-${state.token})` }" />

          <p class="md1-docs-state-label md1-type-caption">{{ state.name }}, {{ state[theme.key] }}</p>
        </div>

        <div class="md1-docs-state">
          <div class="md1-docs-state-fill md1-docs-state-text md1-type-button">Label</div>

          <p class="md1-docs-state-label md1-type-caption">Disabled text, {{ theme.key === 'light' ? 'black 26%' : 'white 30%' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
  .md1-docs-states {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--md1-spacing-2, 16px);
  }

  .md1-docs-states-panel {
    padding: var(--md1-spacing-2, 16px);
    background: var(--md1-surface, #FFFFFF);
    border: 1px solid var(--md1-divider, rgba(0, 0, 0, 0.12));
  }

  .md1-docs-states-name {
    margin: 0 0 var(--md1-spacing-2, 16px);
  }

  .md1-docs-states-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--md1-spacing-2, 16px);
  }

  .md1-docs-state-fill {
    display: flex;
    align-items: center;
    justify-content: center;
    height: var(--md1-touch-target, 48px);
    border: 1px solid var(--md1-divider, rgba(0, 0, 0, 0.12));
    border-radius: var(--md1-radius, 2px);
  }

  .md1-docs-state-text {
    color: var(--md1-button-disabled-text, rgba(0, 0, 0, 0.26));
  }

  .md1-docs-state-label {
    margin: var(--md1-spacing-1, 8px) 0 0;
  }
</style>
