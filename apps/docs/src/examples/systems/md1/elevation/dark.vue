<script setup lang="ts">
  const themes = [
    { id: 'md1-light', name: 'Light theme' },
    { id: 'md1-dark', name: 'Dark theme' },
  ]

  const levels = [2, 8, 24]
</script>

<template>
  <div class="md1-docs-elevation-themes">
    <div
      v-for="theme in themes"
      :key="theme.id"
      class="md1-docs-elevation-theme"
      :data-theme="theme.id"
    >
      <span class="md1-docs-elevation-theme-name md1-type-body-2">{{ theme.name }}</span>

      <div class="md1-docs-elevation-theme-sheets">
        <div
          v-for="level in levels"
          :key="level"
          :class="['md1-docs-elevation-theme-sheet', `md1-elevation-${level}`]"
        >
          <span class="md1-type-title">{{ level }} dp</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
  .md1-docs-elevation-themes {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  }

  .md1-docs-elevation-theme {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-2, 16px);
    padding: var(--md1-spacing-2, 16px) var(--md1-spacing-2, 16px) var(--md1-spacing-5, 40px);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
    background: var(--md1-background, #FAFAFA);
  }

  .md1-docs-elevation-theme-name {
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .md1-docs-elevation-theme-sheets {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--md1-spacing-3, 24px);
  }

  .md1-docs-elevation-theme-sheet {
    display: flex;
    align-items: flex-end;
    height: 80px;
    padding: var(--md1-spacing-1, 8px) var(--md1-spacing-2, 16px);
    background: var(--md1-surface, #FFFFFF);
    border-radius: var(--md1-radius, 2px);
  }
</style>
