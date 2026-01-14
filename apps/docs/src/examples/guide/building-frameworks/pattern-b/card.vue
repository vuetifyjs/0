<script setup lang="ts">
  // Components
  import { ExpansionPanel } from '@vuetify/v0'
  // Utilities
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

    <ExpansionPanel.Root v-model="expanded" multiple>
      <ExpansionPanel.Item
        v-for="card in cards"
        :key="card.value"
        v-slot="{ isExpanded }"
        class="my-card"
        :class="{ 'my-card--expanded': isExpanded }"
        :value="card.value"
      >
        <ExpansionPanel.Header class="my-card__header">
          <ExpansionPanel.Activator class="my-card__activator">
            <span class="my-card__title">{{ card.title }}</span>
            <span
              class="my-card__icon i-mdi-chevron-down"
              :class="{ 'rotate-180': isExpanded }"
            />
          </ExpansionPanel.Activator>
        </ExpansionPanel.Header>

        <ExpansionPanel.Content class="my-card__content">
          {{ card.content }}
        </ExpansionPanel.Content>
      </ExpansionPanel.Item>
    </ExpansionPanel.Root>
  </div>
</template>

<style scoped>
.my-card {
  border: 1px solid var(--v0-color-divider);
  border-radius: 0.5rem;
  overflow: hidden;
  transition: border-color 150ms;
}
.my-card--expanded {
  border-color: var(--v0-color-primary);
}

.my-card__header {
  background: var(--v0-color-surface);
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
  background: var(--v0-color-surface-variant);
}

.my-card__title {
  font-weight: 600;
  color: var(--v0-color-on-surface);
}

.my-card__icon {
  font-size: 1.25rem;
  color: var(--v0-color-on-surface-variant);
  transition: transform 200ms;
}

.my-card__content {
  padding: 0 1rem 1rem;
  color: var(--v0-color-on-surface-variant);
  font-size: 0.875rem;
  line-height: 1.5;
}
</style>
