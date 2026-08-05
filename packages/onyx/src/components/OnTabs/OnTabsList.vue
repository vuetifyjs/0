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
    background: var(--onyx-band-recess), var(--onyx-intaglio, #090605);
    border: var(--onyx-stroke-s, 1px) solid var(--onyx-border, #2f2925);
    border-radius: var(--onyx-radius-lg, 0.5rem);
    box-shadow: var(--onyx-girdle-recess);
    display: inline-flex;
    gap: var(--onyx-spacing-3xs, 2px);
    padding: var(--onyx-spacing-3xs, 2px);
  }
</style>
