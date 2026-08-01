<script lang="ts">
  // Framework
  import { Tabs } from '@vuetify/v0'

  export interface OnTabsPanelProps {
    value: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'OnTabsPanel' })

  const { value } = defineProps<OnTabsPanelProps>()
</script>

<template>
  <Tabs.Panel class="onyx-tabs__panel" :value>
    <slot />
  </Tabs.Panel>
</template>

<!-- Unscoped: Tabs.Panel is a compound child from v0's own file scope; scoped data-v
     never reaches its root (mirrors the OnButton/Button.Root case). -->
<style>
  .onyx-tabs__panel {
    color: var(--onyx-foreground, #fafafa);
    font-size: var(--onyx-text-sm-size, 13px);
    line-height: var(--onyx-text-sm-height, 18px);
    padding-top: var(--onyx-spacing-md, 16px);
  }
</style>
