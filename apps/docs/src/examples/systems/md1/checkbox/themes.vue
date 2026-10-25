<script setup lang="ts">
  import { Md1Checkbox } from '@paper/md1'
  import { ref } from 'vue'

  const THEMES = [
    { id: 'md1-light', name: 'Light theme' },
    { id: 'md1-dark', name: 'Dark theme' },
  ] as const

  const on = ref({ 'md1-light': true, 'md1-dark': true })
  const off = ref({ 'md1-light': false, 'md1-dark': false })
</script>

<template>
  <div class="md1-docs-checkbox-themes">
    <div
      v-for="theme in THEMES"
      :key="theme.id"
      class="md1-docs-checkbox-theme"
      :data-theme="theme.id"
    >
      <p class="md1-docs-checkbox-theme-name md1-type-caption">{{ theme.name }}</p>

      <Md1Checkbox v-model="on[theme.id]" label="On" />

      <Md1Checkbox v-model="off[theme.id]" label="Off" />

      <Md1Checkbox disabled label="Disabled on" :model-value="true" />

      <Md1Checkbox disabled label="Disabled off" :model-value="false" />
    </div>
  </div>
</template>

<style>
  .md1-docs-checkbox-themes {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    width: 100%;
  }

  .md1-docs-checkbox-theme {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: var(--md1-spacing-2, 16px) var(--md1-spacing-3, 24px) var(--md1-spacing-3, 24px);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
    background: var(--md1-background, #FAFAFA);
  }

  .md1-docs-checkbox-theme-name {
    margin: 0 0 var(--md1-spacing-1, 8px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
