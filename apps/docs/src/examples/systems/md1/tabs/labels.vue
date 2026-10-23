<script setup lang="ts">
  import { Md1Tabs } from '@paper/md1'
  import { shallowRef } from 'vue'

  const tab = shallowRef('upcoming')
</script>

<template>
  <div class="md1-docs-tabs-narrow">
    <Md1Tabs v-model="tab">
      <Md1Tabs.List label="Trips">
        <Md1Tabs.Item label="Upcoming" value="upcoming" />

        <Md1Tabs.Item label="Recently completed trips" value="completed" />

        <Md1Tabs.Item label="Saved places and routes for later" value="saved" />
      </Md1Tabs.List>

      <Md1Tabs.Panel class="md1-docs-tabs-panel" value="upcoming">
        One trip booked for next weekend.
      </Md1Tabs.Panel>

      <Md1Tabs.Panel class="md1-docs-tabs-panel" value="completed">
        Four trips this year.
      </Md1Tabs.Panel>

      <Md1Tabs.Panel class="md1-docs-tabs-panel" value="saved">
        Nine saved places.
      </Md1Tabs.Panel>
    </Md1Tabs>
  </div>
</template>

<style>
  .md1-docs-tabs-narrow {
    max-width: 520px;
  }

  .md1-docs-tabs-panel {
    padding: var(--md1-spacing-2, 16px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-body-1-size, 14px);
    line-height: var(--md1-type-body-1-leading, 20px);
  }
</style>
