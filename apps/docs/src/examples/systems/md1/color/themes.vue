<script setup lang="ts">
  import { md1Colors, md1DarkColors, md1Palette } from '@paper/md1'

  // The colour page's two theme figures, one surface per numbered layer. The
  // status bar is a palette value, not a token: a browser has no status bar.
  const THEMES = [
    {
      id: 'md1-light',
      name: 'Light theme',
      status: { token: '--md1-grey-300', value: md1Palette['grey-300'] },
      colors: md1Colors,
    },
    {
      id: 'md1-dark',
      name: 'Dark theme',
      status: { token: '--md1-black', value: md1Palette.black },
      colors: md1DarkColors,
    },
  ] as const
</script>

<template>
  <div class="md1-docs-themes">
    <div
      v-for="theme in THEMES"
      :key="theme.id"
      class="md1-docs-theme"
      :data-theme="theme.id"
    >
      <div class="md1-docs-theme-status md1-type-caption" :style="{ background: `var(${theme.status.token})` }">
        1 Status bar {{ theme.status.value }}
      </div>

      <div class="md1-docs-theme-bar md1-type-title">
        2 App bar {{ theme.colors['app-bar'] }}
      </div>

      <div class="md1-docs-theme-body">
        <p class="md1-docs-theme-label md1-type-caption">3 Background {{ theme.colors.background }}</p>

        <div class="md1-docs-theme-card md1-elevation-2">
          <p class="md1-docs-theme-title md1-type-subheading">4 Cards and dialogs</p>

          <p class="md1-docs-theme-label md1-type-caption">{{ theme.colors.surface }}</p>
        </div>
      </div>

      <p class="md1-docs-theme-name md1-type-body-2">{{ theme.name }}</p>
    </div>
  </div>
</template>

<style>
  .md1-docs-themes {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: var(--md1-spacing-2, 16px);
  }

  .md1-docs-theme {
    overflow: clip;
    background: var(--md1-background, #FAFAFA);
    border: 1px solid var(--md1-divider, rgba(0, 0, 0, 0.12));
  }

  /* 24 dp: the status bar height of the metrics and keylines page. */
  .md1-docs-theme-status {
    display: flex;
    align-items: center;
    height: 24px;
    padding: 0 var(--md1-spacing-2, 16px);
  }

  .md1-docs-theme-bar {
    display: flex;
    align-items: center;
    height: var(--md1-increment, 56px);
    padding: 0 var(--md1-keyline-margin, 16px);
    background: var(--md1-app-bar, #F5F5F5);
  }

  .md1-docs-theme-body {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-1, 8px);
    padding: var(--md1-spacing-2, 16px);
  }

  .md1-docs-theme-card {
    padding: var(--md1-spacing-2, 16px);
    background: var(--md1-surface, #FFFFFF);
    border-radius: var(--md1-radius, 2px);
  }

  .md1-docs-theme-title,
  .md1-docs-theme-label {
    margin: 0;
  }

  .md1-docs-theme-name {
    margin: 0;
    padding: 0 var(--md1-spacing-2, 16px) var(--md1-spacing-2, 16px);
  }
</style>
