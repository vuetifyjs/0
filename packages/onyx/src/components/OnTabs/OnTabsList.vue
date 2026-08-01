<script lang="ts">
  // Framework
  import { Tabs } from '@vuetify/v0'
</script>

<script setup lang="ts">
  defineOptions({ name: 'OnTabsList' })
</script>

<template>
  <Tabs.List class="onyx-tabs__list">
    <slot />
  </Tabs.List>
</template>

<!-- Unscoped: Tabs.List is a compound child from v0's own file scope; scoped data-v
     never reaches its root (mirrors the OnButton/Button.Root case). -->
<style>
  .onyx-tabs__list {
    background: var(--onyx-muted, #27272a);
    border-radius: var(--onyx-radius-md, 0.375rem);
    display: inline-flex;
    gap: var(--onyx-spacing-3xs, 2px);
    padding: 3px;
  }
</style>
