<script lang="ts">
  // Framework
  import { ExpansionPanel } from '@vuetify/v0'

  // Types
  import type { ExpansionPanelActivatorProps } from '@vuetify/v0'

  export interface EmExpansionPanelActivatorProps extends Omit<ExpansionPanelActivatorProps, 'as' | 'renderless'> {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmExpansionPanelActivator' })

  const { namespace } = defineProps<EmExpansionPanelActivatorProps>()
</script>

<template>
  <ExpansionPanel.Activator class="emerald-expansion-panel__activator" :namespace>
    <slot />
  </ExpansionPanel.Activator>
</template>

<style>
  .emerald-expansion-panel__activator {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--emerald-spacing-s, 12px);
    width: 100%;
    margin: 0;
    padding: var(--emerald-spacing-s, 12px) var(--emerald-spacing-m, 16px);
    background: transparent;
    border: 0;
    color: inherit;
    font: inherit;
    font-weight: var(--emerald-text-b1-weight, 500);
    text-align: start;
    cursor: pointer;
    transition: background-color var(--emerald-motion-duration-fast, 120ms) ease;
  }

  .emerald-expansion-panel__activator:hover:not([data-disabled]) {
    background: var(--emerald-neutral-200, #f6f8fa);
  }

  .emerald-expansion-panel__activator:focus-visible {
    outline: none;
    box-shadow: inset var(--emerald-shadow-focus, 0 0 0 5px rgba(38, 194, 109, 0.2));
  }

  .emerald-expansion-panel__activator[data-disabled] {
    cursor: not-allowed;
  }
</style>
