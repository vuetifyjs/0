<script setup lang="ts">
  import { QuTabs } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const sections = ['Top stories', 'World', 'Business', 'Technology', 'Science', 'Health', 'Sports', 'Entertainment', 'Travel', 'Food', 'Opinion', 'Local']

  const section = shallowRef('Top stories')
</script>

<template>
  <QuTabs v-model="section" scrollable>
    <QuTabs.List label="News sections">
      <QuTabs.Item
        v-for="name in sections"
        :key="name"
        :label="name"
        :value="name"
      />
    </QuTabs.List>

    <QuTabs.Panel
      v-for="name in sections"
      :key="name"
      class="quantum-docs-tabs-panel"
      :value="name"
    >
      The latest in {{ name.toLowerCase() }}.
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
