<script setup lang="ts">
  import { QuToolbar, QuTabs } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const tab = shallowRef('songs')

  const rows = Array.from({ length: 24 }, (_, index) => index + 1)
</script>

<template>
  <div class="quantum-docs-screen quantum-docs-toolbar-screen">
    <QuToolbar app-bar scroll="hide" tab-bar="staggered">
      <QuToolbar.Nav />

      <QuToolbar.Title>Library</QuToolbar.Title>

      <QuToolbar.Extension>
        <QuTabs v-model="tab">
          <QuTabs.List label="Library">
            <QuTabs.Item label="Songs" value="songs" />

            <QuTabs.Item label="Albums" value="albums" />

            <QuTabs.Item label="Artists" value="artists" />
          </QuTabs.List>
        </QuTabs>
      </QuToolbar.Extension>
    </QuToolbar>

    <div class="quantum-docs-toolbar-tabs-content">
      <p v-for="row in rows" :key="row" class="quantum-docs-toolbar-text">{{ tab }} {{ row }}: scroll down, then back up. The tab bar returns first; the toolbar returns at the top.</p>
    </div>
  </div>
</template>

<style>
  .quantum-docs-toolbar-screen {
    background: var(--quantum-background, #FAFAFA);
  }

  .quantum-docs-toolbar-tabs-content {
    box-sizing: border-box;
    height: 100%;
    padding: calc(var(--quantum-increment, 56px) + var(--quantum-touch-target, 48px) + var(--quantum-spacing-2, 16px)) var(--quantum-spacing-2, 16px) var(--quantum-spacing-2, 16px);
    overflow-y: auto;
  }

  .quantum-docs-toolbar-text {
    margin: 0 0 var(--quantum-spacing-2, 16px);
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-body-1-size, 14px);
    line-height: var(--quantum-type-body-1-leading, 20px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
