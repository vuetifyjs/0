<script setup lang="ts">
  import { Md1Radio } from '@paper/md1'
  import { ref } from 'vue'

  const THEMES = [
    { id: 'md1-light', name: 'Light theme' },
    { id: 'md1-dark', name: 'Dark theme' },
  ] as const

  const choice = ref({ 'md1-light': 'on', 'md1-dark': 'on' })
</script>

<template>
  <div class="md1-docs-radio-themes">
    <div
      v-for="theme in THEMES"
      :key="theme.id"
      class="md1-docs-radio-theme"
      :data-theme="theme.id"
    >
      <p class="md1-docs-radio-theme-name md1-type-caption">{{ theme.name }}</p>

      <Md1Radio.Group v-model="choice[theme.id]" :aria-label="`Radio buttons, ${theme.name}`">
        <Md1Radio label="On" value="on" />

        <Md1Radio label="Off" value="off" />
      </Md1Radio.Group>

      <Md1Radio.Group :aria-label="`Disabled radio buttons, ${theme.name}`" disabled model-value="on">
        <Md1Radio label="Disabled on" value="on" />

        <Md1Radio label="Disabled off" value="off" />
      </Md1Radio.Group>
    </div>
  </div>
</template>

<style>
  .md1-docs-radio-themes {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    width: 100%;
  }

  .md1-docs-radio-theme {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: var(--md1-spacing-2, 16px) var(--md1-spacing-3, 24px) var(--md1-spacing-3, 24px);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
    background: var(--md1-background, #FAFAFA);
  }

  .md1-docs-radio-theme-name {
    margin: 0 0 var(--md1-spacing-1, 8px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
