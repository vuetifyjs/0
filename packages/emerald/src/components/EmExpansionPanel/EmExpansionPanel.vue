<script lang="ts">
  // Framework
  import { ExpansionPanel } from '@vuetify/v0'

  // Types
  import type { ExpansionPanelRootProps } from '@vuetify/v0'

  export interface EmExpansionPanelProps extends Omit<ExpansionPanelRootProps, 'as' | 'renderless'> {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmExpansionPanel' })

  const {
    id,
    value,
    disabled = false,
    namespace,
  } = defineProps<EmExpansionPanelProps>()
</script>

<template>
  <ExpansionPanel.Root
    :id
    v-slot="slotProps"
    as="div"
    class="emerald-expansion-panel"
    :disabled
    :namespace
    :value
  >
    <slot v-bind="slotProps" />
  </ExpansionPanel.Root>
</template>

<style>
  .emerald-expansion-panel {
    display: flex;
    flex-direction: column;
    width: 100%;
    background: var(--emerald-neutral-100, #fefefe);
    border: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
    border-radius: var(--emerald-radius-m, 8px);
    overflow: clip;
    color: var(--emerald-on-surface, #2b2d2e);
  }

  .emerald-expansion-panel[data-selected] {
    border-color: var(--emerald-primary-500, #6fb38c);
  }

  .emerald-expansion-panel-group[data-disabled] .emerald-expansion-panel {
    opacity: 0.5;
  }
</style>
