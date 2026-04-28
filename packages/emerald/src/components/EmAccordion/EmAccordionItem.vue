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
  border: 0.5px solid rgb(var(--emerald-neutral-channels, 26 28 30) / 0.1);
  border-radius: 6px;
  overflow: clip;
  background: var(--emerald-secondary-50);
  transition: background-color 120ms ease;
}

.emerald-accordion__item[data-selected] {
  background: var(--emerald-secondary-100);
}
</style>
