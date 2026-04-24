<script lang="ts">
  // Framework
  import { ExpansionPanelContent } from '@vuetify/v0'

  export interface EmAccordionContentProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmAccordionContent' })
</script>

<template>
  <ExpansionPanelContent class="emerald-accordion__content">
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </ExpansionPanelContent>
</template>

<style>
.emerald-accordion__content {
  display: block;
  padding: 12px;
  font-family: Manrope, system-ui, -apple-system, sans-serif;
  font-weight: 400;
  font-size: 12px;
  line-height: normal;
  color: #000000;
  border-top: 0.5px solid rgb(var(--emerald-neutral-channels, 26 28 30) / 0.1);
}
</style>
