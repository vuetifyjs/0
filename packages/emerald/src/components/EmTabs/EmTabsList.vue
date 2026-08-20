<script lang="ts">
  // Framework
  import { Tabs } from '@vuetify/v0'

  // Types
  import type { TabsListProps } from '@vuetify/v0'

  export interface EmTabsListProps extends Omit<TabsListProps, 'as' | 'renderless'> {}
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
    display: flex;
    align-items: stretch;
    box-sizing: border-box;
    max-width: 100%;
    width: 100%;
    min-width: 0;
    /* Keep tab labels on one line; scroll instead of overflowing the viewport */
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
  }

  .emerald-tabs__list[aria-orientation='vertical'] {
    flex-direction: column;
    width: fit-content;
    max-width: none;
    overflow-x: visible;
  }
</style>
