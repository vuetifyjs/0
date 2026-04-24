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
  gap: 8px;
  width: 100%;
  padding: 16px 12px;
  font-family: Manrope, system-ui, -apple-system, sans-serif;
  font-weight: 600;
  font-size: 12px;
  line-height: normal;
  color: #000000;
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
}

.emerald-accordion__trigger[aria-disabled="true"] {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>
