<script setup lang="ts">
  import { Md1Tabs } from '@paper/md1'
  import { shallowRef } from 'vue'

  const sections = ['Top stories', 'World', 'Business', 'Technology', 'Science', 'Health', 'Sports', 'Entertainment', 'Travel', 'Food', 'Opinion', 'Local']

  const section = shallowRef('Top stories')
</script>

<template>
  <Md1Tabs v-model="section" scrollable>
    <Md1Tabs.List label="News sections">
      <Md1Tabs.Item
        v-for="name in sections"
        :key="name"
        :label="name"
        :value="name"
      />
    </Md1Tabs.List>

    <Md1Tabs.Panel
      v-for="name in sections"
      :key="name"
      class="md1-docs-tabs-panel"
      :value="name"
    >
      The latest in {{ name.toLowerCase() }}.
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
