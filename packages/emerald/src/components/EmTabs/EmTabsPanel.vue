<script lang="ts">
  // Framework
  import { Tabs } from '@vuetify/v0'

  // Types
  import type { ID } from '@vuetify/v0'

  export interface EmTabsPanelProps {
    value: ID
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmTabsPanel' })

  const { value } = defineProps<EmTabsPanelProps>()
</script>

<template>
  <Tabs.Panel class="emerald-tabs__panel" :value>
    <slot />
  </Tabs.Panel>
</template>

<style>
  .emerald-tabs__panel {
    margin-top: var(--emerald-spacing-m, 16px);
    font-family: var(--emerald-font-sans, Manrope, system-ui, sans-serif);
    font-size: var(--emerald-text-b1-size, 16px);
    line-height: var(--emerald-text-b1-height, 24px);
    color: var(--emerald-on-surface, #2b2d2e);
  }
</style>
