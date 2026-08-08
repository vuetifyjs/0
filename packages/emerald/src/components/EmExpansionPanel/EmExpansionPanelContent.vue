<script lang="ts">
  // Framework
  import { ExpansionPanel } from '@vuetify/v0'

  export interface EmExpansionPanelContentProps {
    namespace?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmExpansionPanelContent' })

  const { namespace } = defineProps<EmExpansionPanelContentProps>()
</script>

<template>
  <ExpansionPanel.Content class="emerald-expansion-panel__content" :namespace>
    <slot />
  </ExpansionPanel.Content>
</template>

<style>
  .emerald-expansion-panel__content {
    padding: 0 var(--emerald-spacing-m, 16px) var(--emerald-spacing-m, 16px);
    font-size: var(--emerald-text-b1-size, 16px);
    line-height: var(--emerald-text-b1-height, 24px);
    color: var(--emerald-on-surface-variant, #757e85);
  }

  .emerald-expansion-panel__content[hidden] {
    display: none;
  }
</style>
