<script setup lang="ts">
  const themes = [
    { id: 'quantum-light', name: 'Light theme' },
    { id: 'quantum-dark', name: 'Dark theme' },
  ]

  const levels = [2, 8, 24]
</script>

<template>
  <div class="quantum-docs-elevation-themes">
    <div
      v-for="theme in themes"
      :key="theme.id"
      class="quantum-docs-elevation-theme"
      :data-theme="theme.id"
    >
      <span class="quantum-docs-elevation-theme-name quantum-type-body-2">{{ theme.name }}</span>

      <div class="quantum-docs-elevation-theme-sheets">
        <div
          v-for="level in levels"
          :key="level"
          :class="['quantum-docs-elevation-theme-sheet', `quantum-elevation-${level}`]"
        >
          <span class="quantum-type-title">{{ level }} dp</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
  .quantum-docs-elevation-themes {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  }

  .quantum-docs-elevation-theme {
    display: flex;
    flex-direction: column;
    gap: var(--quantum-spacing-2, 16px);
    padding: var(--quantum-spacing-2, 16px) var(--quantum-spacing-2, 16px) var(--quantum-spacing-5, 40px);
    color: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
    background: var(--quantum-background, #FAFAFA);
  }

  .quantum-docs-elevation-theme-name {
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .quantum-docs-elevation-theme-sheets {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--quantum-spacing-3, 24px);
  }

  .quantum-docs-elevation-theme-sheet {
    display: flex;
    align-items: flex-end;
    height: 80px;
    padding: var(--quantum-spacing-1, 8px) var(--quantum-spacing-2, 16px);
    background: var(--quantum-surface, #FFFFFF);
    border-radius: var(--quantum-radius, 2px);
  }
</style>
