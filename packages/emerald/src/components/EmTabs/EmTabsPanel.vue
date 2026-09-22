<script lang="ts">
  // Framework
  import { Tabs } from '@vuetify/v0'

  // Types
  import type { ID, TabsPanelProps } from '@vuetify/v0'

  export interface EmTabsPanelProps extends Pick<TabsPanelProps, 'namespace'> {
    value: ID
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmTabsPanel' })

  const { value, namespace } = defineProps<EmTabsPanelProps>()
</script>

<template>
  <Tabs.Panel class="emerald-tabs__panel" :namespace :value>
    <slot />
  </Tabs.Panel>
</template>

<style>
  .emerald-tabs[data-orientation='horizontal'] .emerald-tabs__panel,
  .emerald-tabs:not([data-orientation]) .emerald-tabs__panel {
    margin-block-start: var(--emerald-spacing-m, 16px);
  }

  .emerald-tabs[data-orientation='vertical'] .emerald-tabs__panel {
    margin-inline-start: var(--emerald-spacing-m, 16px);
    margin-block-start: 0;
  }

  .emerald-tabs__panel {
    font-family: var(--emerald-font-sans, Manrope, system-ui, sans-serif);
    font-size: var(--emerald-text-b1-size, 16px);
    line-height: var(--emerald-text-b1-height, 24px);
    color: var(--emerald-on-surface, #2b2d2e);
  }
</style>
