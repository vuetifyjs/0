<script setup lang="ts">
  import { Md1Tabs } from '@paper/md1'
  import { shallowRef } from 'vue'

  const tab = shallowRef('details')
</script>

<template>
  <Md1Tabs v-model="tab">
    <Md1Tabs.List label="Order">
      <Md1Tabs.Item label="Details" value="details" />

      <Md1Tabs.Item label="Shipping" value="shipping" />

      <Md1Tabs.Item label="Payment" value="payment" />
    </Md1Tabs.List>

    <Md1Tabs.Panel class="md1-docs-tabs-panel" value="details">
      Two notebooks and a pen, ordered on 3 October.
    </Md1Tabs.Panel>

    <Md1Tabs.Panel class="md1-docs-tabs-panel" value="shipping">
      Standard delivery to 1600 Amphitheatre Parkway.
    </Md1Tabs.Panel>

    <Md1Tabs.Panel class="md1-docs-tabs-panel" value="payment">
      Paid by card ending 4242.
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
