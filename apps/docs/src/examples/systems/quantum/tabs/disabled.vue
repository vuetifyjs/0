<script setup lang="ts">
  import { QuTabs } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const tab = shallowRef('overview')
</script>

<template>
  <QuTabs v-model="tab">
    <QuTabs.List label="Project">
      <QuTabs.Item label="Overview" value="overview" />

      <QuTabs.Item label="Activity" value="activity" />

      <QuTabs.Item disabled label="Billing" value="billing" />
    </QuTabs.List>

    <QuTabs.Panel class="quantum-docs-tabs-panel" value="overview">
      Three open tasks, due this week.
    </QuTabs.Panel>

    <QuTabs.Panel class="quantum-docs-tabs-panel" value="activity">
      Last change two hours ago.
    </QuTabs.Panel>

    <QuTabs.Panel class="quantum-docs-tabs-panel" value="billing">
      Billing is available to project owners.
    </QuTabs.Panel>
  </QuTabs>
</template>

<style>
  .quantum-docs-tabs-panel {
    padding: var(--quantum-spacing-2, 16px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-body-1-size, 14px);
    line-height: var(--quantum-type-body-1-leading, 20px);
  }
</style>
