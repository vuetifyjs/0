<script lang="ts">
  // Framework
  import { TabsList } from '@vuetify/v0'

  export interface EmTabsListProps {
    label?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmTabsList' })

  const { label } = defineProps<EmTabsListProps>()
</script>

<template>
  <TabsList class="emerald-tabs__list" :label>
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </TabsList>
</template>

<style>
.emerald-tabs__list {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 4px;
  border-radius: 8px;
  border: 1px solid rgb(var(--emerald-neutral-channels, 26 28 30) / 0.1);
  background: rgb(var(--emerald-neutral-channels, 26 28 30) / 0.03);
  width: fit-content;
}

.emerald-tabs__list[aria-orientation="vertical"] {
  flex-direction: column;
  align-items: stretch;
}
</style>
