<script setup lang="ts">
  import { Md1Tabs } from '@paper/md1'
  import { shallowRef } from 'vue'

  const tab = shallowRef('overview')
</script>

<template>
  <Md1Tabs v-model="tab">
    <Md1Tabs.List label="Project">
      <Md1Tabs.Item label="Overview" value="overview" />

      <Md1Tabs.Item label="Activity" value="activity" />

      <Md1Tabs.Item disabled label="Billing" value="billing" />
    </Md1Tabs.List>

    <Md1Tabs.Panel class="md1-docs-tabs-panel" value="overview">
      Three open tasks, due this week.
    </Md1Tabs.Panel>

    <Md1Tabs.Panel class="md1-docs-tabs-panel" value="activity">
      Last change two hours ago.
    </Md1Tabs.Panel>

    <Md1Tabs.Panel class="md1-docs-tabs-panel" value="billing">
      Billing is available to project owners.
    </Md1Tabs.Panel>
  </Md1Tabs>
</template>

<style>
  .md1-docs-tabs-panel {
    padding: var(--md1-spacing-2, 16px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-body-1-size, 14px);
    line-height: var(--md1-type-body-1-leading, 20px);
  }
</style>
