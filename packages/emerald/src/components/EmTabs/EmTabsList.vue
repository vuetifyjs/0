<script lang="ts">
  // Framework
  import { Tabs } from '@vuetify/v0'
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmTabsList' })
</script>

<template>
  <Tabs.List class="emerald-tabs__list">
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
