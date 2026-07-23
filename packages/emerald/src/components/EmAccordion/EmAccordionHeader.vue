<script lang="ts">
  // Framework
  import { ExpansionPanelHeader } from '@vuetify/v0'

  export interface EmAccordionHeaderProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmAccordionHeader' })
</script>

<template>
  <ExpansionPanelHeader class="emerald-accordion__header">
    <slot />
  </ExpansionPanelHeader>
</template>

<style>
.emerald-accordion__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px; /* TODO(token): spec header gap is 10px — no --emerald-spacing token for 10px */
}
</style>
