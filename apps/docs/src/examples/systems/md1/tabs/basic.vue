<script setup lang="ts">
  import { Md1Tabs } from '@paper/md1'
  import { shallowRef } from 'vue'

  const tab = shallowRef('songs')
</script>

<template>
  <Md1Tabs v-model="tab">
    <Md1Tabs.List label="Library">
      <Md1Tabs.Item label="Songs" value="songs" />

      <Md1Tabs.Item label="Albums" value="albums" />

      <Md1Tabs.Item label="Artists" value="artists" />
    </Md1Tabs.List>

    <Md1Tabs.Panel class="md1-docs-tabs-panel" value="songs">
      Every track in your library, newest first.
    </Md1Tabs.Panel>

    <Md1Tabs.Panel class="md1-docs-tabs-panel" value="albums">
      Albums grouped by release, with the ones you play most at the top.
    </Md1Tabs.Panel>

    <Md1Tabs.Panel class="md1-docs-tabs-panel" value="artists">
      Artists in alphabetical order.
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
