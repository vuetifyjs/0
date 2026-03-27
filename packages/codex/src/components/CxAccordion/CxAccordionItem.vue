<script lang="ts">
  // Framework
  import { ExpansionPanel } from '@vuetify/v0'

  export interface CxAccordionItemProps {
    /** Title text displayed in the activator */
    title: string
    /** Disables this accordion item */
    disabled?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxAccordionItem' })

  const { title, disabled = false } = defineProps<CxAccordionItemProps>()
</script>

<template>
  <ExpansionPanel.Item
    class="codex-accordion-item"
    :data-disabled="disabled || undefined"
    :disabled
  >
    <ExpansionPanel.Activator
      v-slot="{ isSelected }"
      class="codex-accordion-item__activator"
    >
      <span class="codex-accordion-item__title">{{ title }}</span>
      <span
        class="codex-accordion-item__chevron"
        :data-expanded="isSelected || undefined"
      >
        &#x203A;
      </span>
    </ExpansionPanel.Activator>

    <ExpansionPanel.Content class="codex-accordion-item__content">
      <slot />
    </ExpansionPanel.Content>
  </ExpansionPanel.Item>
</template>

<style scoped>
  .codex-accordion-item__activator {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    text-align: start;
    cursor: pointer;
    background: transparent;
    border: none;
    font: inherit;
  }

  .codex-accordion-item__activator[data-disabled] {
    cursor: not-allowed;
  }

  .codex-accordion-item__title {
    font-weight: 500;
  }

  .codex-accordion-item__chevron {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s ease;
    transform: rotate(0deg);
    font-size: 1.25em;
    line-height: 1;
  }

  .codex-accordion-item__chevron[data-expanded] {
    transform: rotate(90deg);
  }
</style>
