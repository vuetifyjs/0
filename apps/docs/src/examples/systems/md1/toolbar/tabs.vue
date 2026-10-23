<script setup lang="ts">
  import { Md1Toolbar, Md1Tabs } from '@paper/md1'
  import { shallowRef } from 'vue'

  const tab = shallowRef('songs')

  const rows = Array.from({ length: 24 }, (_, index) => index + 1)
</script>

<template>
  <div class="md1-docs-screen md1-docs-toolbar-screen">
    <Md1Toolbar app-bar scroll="hide" tab-bar="staggered">
      <Md1Toolbar.Nav />

      <Md1Toolbar.Title>Library</Md1Toolbar.Title>

      <Md1Toolbar.Extension>
        <Md1Tabs v-model="tab">
          <Md1Tabs.List label="Library">
            <Md1Tabs.Item label="Songs" value="songs" />

            <Md1Tabs.Item label="Albums" value="albums" />

            <Md1Tabs.Item label="Artists" value="artists" />
          </Md1Tabs.List>
        </Md1Tabs>
      </Md1Toolbar.Extension>
    </Md1Toolbar>

    <div class="md1-docs-toolbar-tabs-content">
      <p v-for="row in rows" :key="row" class="md1-docs-toolbar-text">{{ tab }} {{ row }}: scroll down, then back up. The tab bar returns first; the toolbar returns at the top.</p>
    </div>
  </div>
</template>

<style>
  .md1-docs-toolbar-screen {
    background: var(--md1-background, #FAFAFA);
  }

  .md1-docs-toolbar-tabs-content {
    box-sizing: border-box;
    height: 100%;
    padding: calc(var(--md1-increment, 56px) + var(--md1-touch-target, 48px) + var(--md1-spacing-2, 16px)) var(--md1-spacing-2, 16px) var(--md1-spacing-2, 16px);
    overflow-y: auto;
  }

  .md1-docs-toolbar-text {
    margin: 0 0 var(--md1-spacing-2, 16px);
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-body-1-size, 14px);
    line-height: var(--md1-type-body-1-leading, 20px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
