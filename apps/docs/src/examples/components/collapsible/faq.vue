<script setup lang="ts">
  import FaqItem from './FaqItem.vue'

  const items = [
    {
      question: 'What is the difference between Collapsible and ExpansionPanel?',
      answer: 'Collapsible manages a single boolean open/closed state. ExpansionPanel coordinates multiple collapsible items with shared selection logic, supporting single-expand (accordion) and multi-expand modes.',
    },
    {
      question: 'Can I animate the content?',
      answer: 'Yes. The data-state attribute on both the activator and content elements transitions between "open" and "closed", which you can target with CSS transitions or animations.',
    },
    {
      question: 'Is it accessible?',
      answer: 'Collapsible follows the WAI-ARIA Disclosure pattern. The activator has aria-expanded, aria-controls, and keyboard support (Enter/Space). The content region has role="region" and aria-labelledby pointing back to the activator.',
    },
    {
      question: 'Can I use it without v-model?',
      answer: 'Yes. Without v-model:open, the component manages its own internal state. It starts closed by default.',
      disabled: true,
    },
  ]
</script>

<template>
  <div class="border border-divider rounded-lg overflow-hidden bg-surface">
    <FaqItem
      v-for="(item, index) in items"
      :key="index"
      :disabled="item.disabled"
      :question="item.question"
    >
      {{ item.answer }}
    </FaqItem>
  </div>
</template>
