<script setup lang="ts">
  import { QuTabs } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const tab = shallowRef('upcoming')
</script>

<template>
  <div class="quantum-docs-tabs-narrow">
    <QuTabs v-model="tab">
      <QuTabs.List label="Trips">
        <QuTabs.Item label="Upcoming" value="upcoming" />

        <QuTabs.Item label="Recently completed trips" value="completed" />

        <QuTabs.Item label="Saved places and routes for later" value="saved" />
      </QuTabs.List>

      <QuTabs.Panel class="quantum-docs-tabs-panel" value="upcoming">
        One trip booked for next weekend.
      </QuTabs.Panel>

      <QuTabs.Panel class="quantum-docs-tabs-panel" value="completed">
        Four trips this year.
      </QuTabs.Panel>

      <QuTabs.Panel class="quantum-docs-tabs-panel" value="saved">
        Nine saved places.
      </QuTabs.Panel>
    </QuTabs>
  </div>
</template>

<style>
  .quantum-docs-tabs-narrow {
    max-width: 520px;
  }

  .quantum-docs-tabs-panel {
    padding: var(--quantum-spacing-2, 16px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-body-1-size, 14px);
    line-height: var(--quantum-type-body-1-leading, 20px);
  }
</style>
