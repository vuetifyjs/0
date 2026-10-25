<script setup lang="ts">
  import { Md1Button, Md1Tabs, Md1Toolbar } from '@paper/md1'
  import { shallowRef } from 'vue'

  const tab = shallowRef('one')

  const tabs = [
    { value: 'one', label: 'Overview' },
    { value: 'two', label: 'Activity' },
    { value: 'three', label: 'Members' },
  ]
</script>

<template>
  <div class="md1-docs-nav-desktop">
    <Md1Tabs v-model="tab" scrollable>
      <Md1Toolbar variant="primary">
        <Md1Toolbar.Actions>
          <Md1Button aria-label="Search" icon="search" />

          <Md1Button aria-label="More options" icon="more-vert" />
        </Md1Toolbar.Actions>

        <Md1Toolbar.Extension>
          <Md1Toolbar.Title>Atlas</Md1Toolbar.Title>

          <Md1Tabs.List label="Project">
            <Md1Tabs.Item v-for="item in tabs" :key="item.value" :label="item.label" :value="item.value" />
          </Md1Tabs.List>
        </Md1Toolbar.Extension>
      </Md1Toolbar>

      <Md1Tabs.Panel v-for="item in tabs" :key="item.value" class="md1-docs-nav-desktop-panel" :value="item.value">
        {{ item.label }}: the tabs start at the title's keyline, so the title and the views read as one column.
      </Md1Tabs.Panel>
    </Md1Tabs>
  </div>
</template>

<style>
  /* A desktop window: the extended header carries the title, and the tabs sit left-aligned under it. */
  .md1-docs-nav-desktop {
    width: 100%;
    max-width: 960px;
    overflow: hidden;
    background: var(--md1-background, #FAFAFA);
  }

  .md1-docs-nav-desktop-panel {
    min-height: 120px;
    padding: var(--md1-spacing-3, 24px) var(--md1-spacing-3, 24px) var(--md1-spacing-3, 24px) 80px;
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-body-1-size, 14px);
    line-height: var(--md1-type-body-1-leading, 20px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
