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

<style scoped>
.emerald-tabs__list {
  display: inline-flex;
  align-items: stretch;
  width: fit-content;
}

.emerald-tabs__list[aria-orientation="vertical"] {
  flex-direction: column;
}
</style>
