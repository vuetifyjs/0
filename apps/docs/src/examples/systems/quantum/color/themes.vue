<script setup lang="ts">
  import { quantumColors, quantumDarkColors, quantumPalette } from '@paper/quantum'

  // The colour page's two theme figures, one surface per numbered layer. The
  // status bar is a palette value, not a token: a browser has no status bar.
  const THEMES = [
    {
      id: 'quantum-light',
      name: 'Light theme',
      status: { token: '--quantum-grey-300', value: quantumPalette['grey-300'] },
      colors: quantumColors,
    },
    {
      id: 'quantum-dark',
      name: 'Dark theme',
      status: { token: '--quantum-black', value: quantumPalette.black },
      colors: quantumDarkColors,
    },
  ] as const
</script>

<template>
  <div class="quantum-docs-themes">
    <div
      v-for="theme in THEMES"
      :key="theme.id"
      class="quantum-docs-theme"
      :data-theme="theme.id"
    >
      <div class="quantum-docs-theme-status quantum-type-caption" :style="{ background: `var(${theme.status.token})` }">
        1 Status bar {{ theme.status.value }}
      </div>

      <div class="quantum-docs-theme-bar quantum-type-title">
        2 App bar {{ theme.colors['app-bar'] }}
      </div>

      <div class="quantum-docs-theme-body">
        <p class="quantum-docs-theme-label quantum-type-caption">3 Background {{ theme.colors.background }}</p>

        <div class="quantum-docs-theme-card quantum-elevation-2">
          <p class="quantum-docs-theme-title quantum-type-subheading">4 Cards and dialogs</p>

          <p class="quantum-docs-theme-label quantum-type-caption">{{ theme.colors.surface }}</p>
        </div>
      </div>

      <p class="quantum-docs-theme-name quantum-type-body-2">{{ theme.name }}</p>
    </div>
  </div>
</template>

<style>
  .quantum-docs-themes {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: var(--quantum-spacing-2, 16px);
  }

  .quantum-docs-theme {
    overflow: clip;
    background: var(--quantum-background, #FAFAFA);
    border: 1px solid var(--quantum-divider, rgba(0, 0, 0, 0.12));
  }

  /* 24 dp: the status bar height of the metrics and keylines page. */
  .quantum-docs-theme-status {
    display: flex;
    align-items: center;
    height: 24px;
    padding: 0 var(--quantum-spacing-2, 16px);
  }

  .quantum-docs-theme-bar {
    display: flex;
    align-items: center;
    height: var(--quantum-increment, 56px);
    padding: 0 var(--quantum-keyline-margin, 16px);
    background: var(--quantum-app-bar, #F5F5F5);
  }

  .quantum-docs-theme-body {
    display: flex;
    flex-direction: column;
    gap: var(--quantum-spacing-1, 8px);
    padding: var(--quantum-spacing-2, 16px);
  }

  .quantum-docs-theme-card {
    padding: var(--quantum-spacing-2, 16px);
    background: var(--quantum-surface, #FFFFFF);
    border-radius: var(--quantum-radius, 2px);
  }

  .quantum-docs-theme-title,
  .quantum-docs-theme-label {
    margin: 0;
  }

  .quantum-docs-theme-name {
    margin: 0;
    padding: 0 var(--quantum-spacing-2, 16px) var(--quantum-spacing-2, 16px);
  }
</style>
