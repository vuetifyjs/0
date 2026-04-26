<script lang="ts">
  // Framework
  import { TabsPanel } from '@vuetify/v0'

  export interface EmTabsPanelProps<V = unknown> {
    value: V
  }
</script>

<script setup lang="ts" generic="V = unknown">
  defineOptions({ name: 'EmTabsPanel' })

  const { value } = defineProps<EmTabsPanelProps<V>>()
</script>

<template>
  <TabsPanel class="emerald-tabs__panel" :value>
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </TabsPanel>
</template>

<style>
.emerald-tabs__panel {
  padding: 12px 0;
  font-family: Manrope, system-ui, -apple-system, sans-serif;
  font-size: 14px;
  color: var(--emerald-primary-950, #221065);
}

.emerald-tabs__panel[hidden] {
  display: none;
}
</style>
