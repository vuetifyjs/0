<script lang="ts">
  // Framework
  import { ExpansionPanel } from '@vuetify/v0'

  export interface HxAccordionItemProps {
    /** Title text displayed in the activator */
    title: string
    /** Disables this accordion item */
    disabled?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'HxAccordionItem' })

  const { title, disabled = false } = defineProps<HxAccordionItemProps>()
</script>

<template>
  <ExpansionPanel.Item
    class="helix-accordion-item"
    :data-disabled="disabled || undefined"
    :disabled
  >
    <ExpansionPanel.Activator
      v-slot="{ isSelected }"
      class="helix-accordion-item__activator"
    >
      <span class="helix-accordion-item__title">{{ title }}</span>
      <span
        class="helix-accordion-item__chevron"
        :data-expanded="isSelected || undefined"
      >
        &#x203A;
      </span>
    </ExpansionPanel.Activator>

    <ExpansionPanel.Content class="helix-accordion-item__content">
      <slot />
    </ExpansionPanel.Content>
  </ExpansionPanel.Item>
</template>

<style scoped>
  .helix-accordion-item {
    border-bottom: 1px solid var(--v0-divider);
  }

  .helix-accordion-item:last-child {
    border-bottom: none;
  }

  .helix-accordion-item__activator {
    display: flex;
    align-items: center;
    justify-content: space-between;
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

  .helix-accordion-item__activator:hover {
    background-color: var(--v0-surface-tint);
  }

  .helix-accordion-item__activator:focus-visible {
    outline: 2px solid var(--v0-primary);
    outline-offset: -2px;
  }

  .helix-accordion-item__activator[data-disabled] {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .helix-accordion-item__title {
    font-weight: 500;
  }

  .helix-accordion-item__chevron {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s ease;
    transform: rotate(0deg);
    font-size: 1.25em;
    line-height: 1;
    color: var(--v0-on-surface-variant);
  }

  .helix-accordion-item__chevron[data-expanded] {
    transform: rotate(90deg);
  }

  .helix-accordion-item__content {
    padding: 0 1rem 0.75rem;
    color: var(--v0-on-surface-variant);
  }
</style>
