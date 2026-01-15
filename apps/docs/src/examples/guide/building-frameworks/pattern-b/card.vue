<script setup lang="ts">
  import { ExpansionPanel } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const expanded = shallowRef<string[]>(['features'])

  const cards = [
    {
      value: 'features',
      title: 'Key Features',
      content: 'Headless components, composables, and utilities for building design systems. Full TypeScript support with generic constraints.',
    },
    {
      value: 'ssr',
      title: 'SSR Ready',
      content: 'Built for universal rendering. All composables are SSR-safe with hydration state management included.',
    },
    {
      value: 'a11y',
      title: 'Accessible',
      content: 'ARIA attributes, keyboard navigation, and focus management built into every component.',
    },
  ]
</script>

<template>
  <div class="space-y-3">
    <p class="text-sm text-on-surface-variant mb-4">
      Wrapping v0's ExpansionPanel with custom styling:
    </p>

    <ExpansionPanel.Root v-model="expanded" class="space-y-3" multiple>
      <ExpansionPanel.Item
        v-for="card in cards"
        :key="card.value"
        v-slot="{ isSelected }"
        class="my-card"
        :value="card.value"
      >
        <ExpansionPanel.Header class="my-card__header">
          <ExpansionPanel.Activator class="my-card__activator">
            <span class="my-card__title">{{ card.title }}</span>
            <svg
              class="my-card__icon"
              :class="{ 'rotate-180': isSelected }"
              fill="currentColor"
              height="20"
              viewBox="0 0 24 24"
              width="20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
            </svg>
          </ExpansionPanel.Activator>
        </ExpansionPanel.Header>

        <ExpansionPanel.Content class="my-card__content">
          {{ card.content }}
        </ExpansionPanel.Content>
      </ExpansionPanel.Item>
    </ExpansionPanel.Root>
  </div>
</template>

<style>
.my-card {
  border: 1px solid var(--v0-divider);
  border-radius: 0.5rem;
  overflow: hidden;
  transition: border-color 150ms;
}
.my-card[data-selected] {
  border-color: var(--v0-primary);
}

.my-card__header {
  background: var(--v0-surface);
}

.my-card__activator {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
  transition: background 150ms;
}
.my-card__activator:hover {
  background: var(--v0-surface-variant);
}

.my-card__title {
  font-weight: 600;
  color: var(--v0-on-surface);
}

.my-card__icon {
  color: var(--v0-on-surface-variant);
  transition: transform 200ms;
}

.my-card__content {
  padding: 0 1rem 1rem;
  color: var(--v0-on-surface-variant);
  font-size: 0.875rem;
  line-height: 1.5;
}
</style>
