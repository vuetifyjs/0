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
  .helix-faq-item__activator {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
    text-align: start;
    cursor: pointer;
    background: transparent;
    border: none;
    font: inherit;
  }

  .helix-faq-item__indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 50%;
    font-size: 0.75rem;
    font-family: monospace;
  }

  .helix-faq-item__question {
    font-weight: 500;
  }
</style>
