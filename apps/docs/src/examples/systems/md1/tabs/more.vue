<script setup lang="ts">
  import { Md1Tabs } from '@paper/md1'
  import { shallowRef } from 'vue'

  const stores = ['Home', 'Apps', 'Games', 'Movies & TV', 'Music', 'Books', 'Newsstand', 'Devices', 'Family', 'Editors\' choice', 'Top charts', 'New releases']

  const store = shallowRef('Home')
</script>

<template>
  <Md1Tabs v-model="store" more scrollable>
    <Md1Tabs.List label="Store sections">
      <Md1Tabs.Item
        v-for="name in stores"
        :key="name"
        :label="name"
        :value="name"
      />
    </Md1Tabs.List>

    <Md1Tabs.Panel
      v-for="name in stores"
      :key="name"
      class="md1-docs-tabs-panel"
      :value="name"
    >
      Browse {{ name.toLowerCase() }}.
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
