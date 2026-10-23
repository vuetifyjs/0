<script setup lang="ts">
  import { QuTabs } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const tab = shallowRef('details')
</script>

<template>
  <QuTabs v-model="tab">
    <QuTabs.List label="Order">
      <QuTabs.Item label="Details" value="details" />

      <QuTabs.Item label="Shipping" value="shipping" />

      <QuTabs.Item label="Payment" value="payment" />
    </QuTabs.List>

    <QuTabs.Panel class="quantum-docs-tabs-panel" value="details">
      Two notebooks and a pen, ordered on 3 October.
    </QuTabs.Panel>

    <QuTabs.Panel class="quantum-docs-tabs-panel" value="shipping">
      Standard delivery to 1600 Amphitheatre Parkway.
    </QuTabs.Panel>

    <QuTabs.Panel class="quantum-docs-tabs-panel" value="payment">
      Paid by card ending 4242.
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
