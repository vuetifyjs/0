<script setup lang="ts">
  import { Md1Tabs } from '@paper/md1'
  import { shallowRef } from 'vue'

  const tab = shallowRef('recents')
</script>

<template>
  <Md1Tabs v-model="tab">
    <Md1Tabs.List label="Contacts">
      <Md1Tabs.Item icon="phone" label="Recents" value="recents" />

      <Md1Tabs.Item icon="favorite" label="Favorites" value="favorites" />

      <Md1Tabs.Item icon="place" label="Nearby" value="nearby" />
    </Md1Tabs.List>

    <Md1Tabs.Panel class="md1-docs-tabs-panel" value="recents">
      Calls from the last seven days.
    </Md1Tabs.Panel>

    <Md1Tabs.Panel class="md1-docs-tabs-panel" value="favorites">
      The people you starred.
    </Md1Tabs.Panel>

    <Md1Tabs.Panel class="md1-docs-tabs-panel" value="nearby">
      Contacts who share their location with you.
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
