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
}

.emerald-accordion__content[hidden] {
  display: grid;
  grid-template-rows: 0fr;
}

.emerald-accordion__content-inner {
  min-height: 0;
  overflow: hidden;
  /* TODO(token): spec content section is pl-23 pr-10 — no --emerald-spacing tokens for 23px / 10px */
  padding: var(--emerald-spacing-xs) 10px var(--emerald-spacing-xs) 23px;
  transition: visibility 0s linear 280ms;
}

.emerald-accordion__content[data-selected] .emerald-accordion__content-inner {
  visibility: visible;
  transition-delay: 0s;
}

.emerald-accordion__content[hidden] .emerald-accordion__content-inner {
  visibility: hidden;
}
</style>
