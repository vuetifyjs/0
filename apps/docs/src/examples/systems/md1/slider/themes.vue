<script setup lang="ts">
  import { Md1Slider } from '@paper/md1'
  import { ref } from 'vue'

  const THEMES = [
    { id: 'md1-light', name: 'Light theme' },
    { id: 'md1-dark', name: 'Dark theme' },
  ] as const

  const volume = ref({ 'md1-light': 40, 'md1-dark': 40 })
  const level = ref({ 'md1-light': 30, 'md1-dark': 30 })
</script>

<template>
  <div class="md1-docs-slider-themes">
    <div
      v-for="theme in THEMES"
      :key="theme.id"
      class="md1-docs-slider-theme"
      :data-theme="theme.id"
    >
      <p class="md1-docs-slider-theme-name md1-type-caption">{{ theme.name }}</p>

      <Md1Slider v-model="volume[theme.id]" label="Volume" />

      <Md1Slider v-model="level[theme.id]" discrete label="Brightness" :step="10" />
    </div>
  </div>
</template>

<style>
  .md1-docs-slider-themes {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    width: 100%;
  }

  .md1-docs-slider-theme {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    padding: var(--md1-spacing-2, 16px) var(--md1-spacing-3, 24px) var(--md1-spacing-3, 24px);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
    background: var(--md1-background, #FAFAFA);
  }

  .md1-docs-slider-theme-name {
    margin: 0 0 var(--md1-spacing-1, 8px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
