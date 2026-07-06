<script lang="ts">
  // Framework
  import { ExpansionPanelRoot } from '@vuetify/v0'

  export interface EmAccordionItemProps {
    id?: string
    value?: unknown
    disabled?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmAccordionItem' })

  const { id, value, disabled = false } = defineProps<EmAccordionItemProps>()
</script>

<template>
  <ExpansionPanelRoot
    :id
    as="div"
    class="emerald-accordion__item"
    :disabled
    :value
  >
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </ExpansionPanelRoot>
</template>

<style>
.emerald-accordion__item {
  display: flex;
  flex-direction: column;
  border-top: var(--emerald-stroke-s) solid var(--emerald-divider);
  transition: background-color 120ms ease;
}

.emerald-accordion__item:last-child {
  border-bottom: var(--emerald-stroke-s) solid var(--emerald-divider);
}

.emerald-accordion__item[data-selected] {
  background: var(--emerald-neutral-alpha-gray-20);
  border-radius: var(--emerald-radius-xs);
}
</style>
