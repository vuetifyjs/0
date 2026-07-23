<script lang="ts">
  // Framework
  import { ExpansionPanelActivator } from '@vuetify/v0'

  export interface EmAccordionTriggerProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmAccordionTrigger' })
</script>

<template>
  <ExpansionPanelActivator class="emerald-accordion__trigger">
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </ExpansionPanelActivator>
</template>

<style>
.emerald-accordion__trigger {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  gap: 10px; /* TODO(token): spec header gap is 10px — no --emerald-spacing token for 10px */
  width: 100%;
  padding: var(--emerald-spacing-s);
  font: inherit;
  color: inherit;
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: start;
}

.emerald-accordion__trigger[data-selected] {
  font-weight: 700;
  color: var(--emerald-success-600);
}

.emerald-accordion__trigger[aria-disabled="true"] {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>
