<script lang="ts">
  // Framework
  import { ExpansionPanel } from '@vuetify/v0'

  // Types
  import type { ExpansionPanelHeaderProps } from '@vuetify/v0'

  export interface EmExpansionPanelHeaderProps extends Omit<ExpansionPanelHeaderProps, 'as' | 'renderless'> {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmExpansionPanelHeader' })

  const { namespace } = defineProps<EmExpansionPanelHeaderProps>()
</script>

<template>
  <ExpansionPanel.Header class="emerald-expansion-panel__header" :namespace>
    <slot />
  </ExpansionPanel.Header>
</template>

<style>
  .emerald-expansion-panel__header {
    margin: 0;
    font-size: inherit;
    font-weight: inherit;
    line-height: inherit;
  }
</style>
