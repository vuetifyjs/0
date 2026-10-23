<script setup lang="ts">
  // The state overlays each theme publishes, painted over the theme's sheet.
  const STATES = [
    { token: 'hover', name: 'Hover', light: 'black 6%', dark: 'white 10%' },
    { token: 'focus', name: 'Focus', light: 'black 12%', dark: 'white 12%' },
    { token: 'pressed', name: 'Pressed', light: '#999999 40%', dark: '#CCCCCC 25%' },
    { token: 'selection', name: 'Selection', light: 'accent 30%', dark: 'accent 30%' },
    { token: 'button-disabled', name: 'Disabled fill', light: 'black 12%', dark: 'white 12%' },
  ] as const

  const THEMES = [
    { id: 'quantum-light', name: 'Light theme', key: 'light' },
    { id: 'quantum-dark', name: 'Dark theme', key: 'dark' },
  ] as const
</script>

<template>
  <div class="quantum-docs-states">
    <div
      v-for="theme in THEMES"
      :key="theme.id"
      class="quantum-docs-states-panel"
      :data-theme="theme.id"
    >
      <p class="quantum-docs-states-name quantum-type-caption">{{ theme.name }}</p>

      <div class="quantum-docs-states-grid">
        <div v-for="state in STATES" :key="state.token" class="quantum-docs-state">
          <div class="quantum-docs-state-fill" :style="{ background: `var(--quantum-${state.token})` }" />

          <p class="quantum-docs-state-label quantum-type-caption">{{ state.name }}, {{ state[theme.key] }}</p>
        </div>

        <div class="quantum-docs-state">
          <div class="quantum-docs-state-fill quantum-docs-state-text quantum-type-button">Label</div>

          <p class="quantum-docs-state-label quantum-type-caption">Disabled text, {{ theme.key === 'light' ? 'black 26%' : 'white 30%' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
  .quantum-docs-states {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--quantum-spacing-2, 16px);
  }

  .quantum-docs-states-panel {
    padding: var(--quantum-spacing-2, 16px);
    background: var(--quantum-surface, #FFFFFF);
    border: 1px solid var(--quantum-divider, rgba(0, 0, 0, 0.12));
  }

  .quantum-docs-states-name {
    margin: 0 0 var(--quantum-spacing-2, 16px);
  }

  .quantum-docs-states-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--quantum-spacing-2, 16px);
  }

  .quantum-docs-state-fill {
    display: flex;
    align-items: center;
    justify-content: center;
    height: var(--quantum-touch-target, 48px);
    border: 1px solid var(--quantum-divider, rgba(0, 0, 0, 0.12));
    border-radius: var(--quantum-radius, 2px);
  }

  .quantum-docs-state-text {
    color: var(--quantum-button-disabled-text, rgba(0, 0, 0, 0.26));
  }

  .quantum-docs-state-label {
    margin: var(--quantum-spacing-1, 8px) 0 0;
  }
</style>
