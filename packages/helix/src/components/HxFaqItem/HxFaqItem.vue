<script lang="ts">
  // Framework
  import { ExpansionPanel } from '@vuetify/v0'

  export interface HxFaqItemProps {
    /** The question text displayed in the activator */
    question: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'HxFaqItem' })

  const { question } = defineProps<HxFaqItemProps>()
</script>

<template>
  <ExpansionPanel.Item class="helix-faq-item">
    <ExpansionPanel.Activator
      v-slot="{ isSelected }"
      class="helix-faq-item__activator"
    >
      <span
        class="helix-faq-item__indicator"
        :data-selected="isSelected || undefined"
      >
        {{ isSelected ? '\u2212' : '?' }}
      </span>
      <span class="helix-faq-item__question">{{ question }}</span>
    </ExpansionPanel.Activator>

    <ExpansionPanel.Content class="helix-faq-item__content">
      <slot />
    </ExpansionPanel.Content>
  </ExpansionPanel.Item>
</template>

<style scoped>
  .helix-faq-item {
    border: 1px solid var(--v0-divider);
    border-radius: 0.5rem;
    overflow: hidden;
  }

  .helix-faq-item__activator {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
    padding: 0.75rem 1rem;
    text-align: start;
    cursor: pointer;
    background: transparent;
    border: none;
    font: inherit;
    color: var(--v0-on-surface);
    transition: background-color 150ms ease;
  }

  .helix-faq-item__activator:hover {
    background-color: var(--v0-surface-tint);
  }

  .helix-faq-item__activator:focus-visible {
    outline: 2px solid var(--v0-primary);
    outline-offset: -2px;
  }

  .helix-faq-item__indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    border: 1.5px solid var(--v0-divider);
    background-color: var(--v0-surface);
    font-size: 0.75rem;
    font-family: monospace;
    color: var(--v0-on-surface-variant);
    transition: background-color 150ms ease, border-color 150ms ease, color 150ms ease;
  }

  .helix-faq-item__indicator[data-selected] {
    background-color: var(--v0-primary);
    border-color: var(--v0-primary);
    color: var(--v0-on-primary);
  }

  .helix-faq-item__question {
    font-weight: 600;
  }

  .helix-faq-item__content {
    padding: 0 1rem 0.75rem 3.25rem;
    color: var(--v0-on-surface-variant);
  }
</style>
