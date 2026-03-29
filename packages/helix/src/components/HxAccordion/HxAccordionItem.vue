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
  .helix-accordion-item__activator {
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

  .helix-accordion-item__activator[data-disabled] {
    cursor: not-allowed;
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
  }

  .helix-accordion-item__chevron[data-expanded] {
    transform: rotate(90deg);
  }
</style>
