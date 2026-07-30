<script lang="ts">
  // Framework
  import { Tabs } from '@vuetify/v0'

  export interface EmTabsListProps {
    /** Accessible name for the tablist when no visible label is associated */
    label?: string
    namespace?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmTabsList' })

  const { label, namespace } = defineProps<EmTabsListProps>()
</script>

<template>
  <Tabs.List class="emerald-tabs__list" :label :namespace>
    <slot />
  </Tabs.List>
</template>

<style>
  .emerald-tabs__list {
    display: inline-flex;
    align-items: stretch;
    width: fit-content;
  }

  .emerald-tabs__list[aria-orientation='vertical'] {
    flex-direction: column;
  }
</style>
