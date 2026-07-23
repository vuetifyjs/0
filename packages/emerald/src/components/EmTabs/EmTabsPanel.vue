<script lang="ts">
  // Framework
  import { TabsPanel } from '@vuetify/v0'

  export interface EmTabsPanelProps<V = unknown> {
    value: V
  }
</script>

<script lang="ts" setup generic="V = unknown">
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

<style scoped>
.emerald-tabs__panel {
  padding: var(--emerald-spacing-s) 0;
  font-size: var(--emerald-text-b2-size);
  line-height: var(--emerald-text-b2-height);
  animation: emerald-tabs-fade 280ms cubic-bezier(0.16, 1, 0.3, 1);
}

.emerald-tabs__panel[hidden] {
  display: none;
}

@keyframes emerald-tabs-fade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
