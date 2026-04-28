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
      <div class="emerald-accordion__content-inner">
        <slot v-bind="slotProps" />
      </div>
    </template>
  </ExpansionPanelContent>
</template>

<style>
.emerald-accordion__content {
  display: grid;
  grid-template-rows: 1fr;
  transition: grid-template-rows 280ms cubic-bezier(0.4, 0.0, 0.2, 1);
  font-family: Manrope, system-ui, -apple-system, sans-serif;
  font-weight: 400;
  font-size: 12px;
  line-height: normal;
  color: #000000;
}

.emerald-accordion__content[hidden] {
  display: grid;
  grid-template-rows: 0fr;
}

.emerald-accordion__content-inner {
  min-height: 0;
  overflow: hidden;
  padding: 12px;
  transition: visibility 0s linear 280ms;
}

.emerald-accordion__content[data-selected] .emerald-accordion__content-inner {
  visibility: visible;
  transition-delay: 0s;
}

.emerald-accordion__content[hidden] .emerald-accordion__content-inner {
  visibility: hidden;
}

.emerald-accordion__content[data-selected] .emerald-accordion__content-inner {
  border-top: 0.5px solid rgb(var(--emerald-neutral-channels, 26 28 30) / 0.1);
}
</style>
