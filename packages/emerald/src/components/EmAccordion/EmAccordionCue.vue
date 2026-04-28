<script lang="ts">
  // Framework
  import { ExpansionPanelCue } from '@vuetify/v0'

  export interface EmAccordionCueProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmAccordionCue' })
</script>

<template>
  <ExpansionPanelCue class="emerald-accordion__cue">
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </ExpansionPanelCue>
</template>

<style>
.emerald-accordion__cue {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  color: currentColor;
  flex-shrink: 0;
}
</style>
