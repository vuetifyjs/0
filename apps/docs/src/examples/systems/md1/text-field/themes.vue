<script setup lang="ts">
  import { Md1TextField } from '@paper/md1'
  import { shallowRef } from 'vue'

  const THEMES = [
    { id: 'md1-light', name: 'Light theme' },
    { id: 'md1-dark', name: 'Dark theme' },
  ] as const

  const empty = shallowRef('')
  const filled = shallowRef('Ana Lima')
  const error = shallowRef('ana@')
  const disabled = shallowRef('Lisbon')
  const notes = shallowRef('')
</script>

<template>
  <div class="md1-docs-field-themes">
    <div
      v-for="theme in THEMES"
      :key="theme.id"
      class="md1-docs-field-theme"
      :data-theme="theme.id"
    >
      <p class="md1-docs-field-theme-name md1-type-caption">{{ theme.name }}</p>

      <Md1TextField v-model="empty" helper="Empty and idle" label="Name" />

      <Md1TextField v-model="filled" helper="Filled" label="Name" />

      <Md1TextField
        v-model="error"
        error
        error-messages="Error: enter an address like name@example.com"
        label="Email"
      />

      <Md1TextField v-model="disabled" disabled label="City" />

      <Md1TextField v-model="notes" label="Notes" textarea />
    </div>
  </div>
</template>

<style>
  .md1-docs-field-themes {
    display: grid;
    width: 100%;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  }

  .md1-docs-field-theme {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-2, 16px);
    padding: var(--md1-spacing-2, 16px) var(--md1-spacing-3, 24px) var(--md1-spacing-3, 24px);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
    background: var(--md1-background, #FAFAFA);
  }

  .md1-docs-field-theme-name {
    margin: 0;
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
