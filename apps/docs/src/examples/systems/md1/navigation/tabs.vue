<script setup lang="ts">
  import { Md1Tabs, Md1Toolbar } from '@paper/md1'
  import { shallowRef } from 'vue'

  const tab = shallowRef('songs')
</script>

<template>
  <div class="md1-docs-nav-frame">
    <Md1Tabs v-model="tab">
      <Md1Toolbar variant="primary">
        <Md1Toolbar.Nav />

        <Md1Toolbar.Title>Music</Md1Toolbar.Title>

        <Md1Toolbar.Extension>
          <Md1Tabs.List label="Library">
            <Md1Tabs.Item label="Songs" value="songs" />

            <Md1Tabs.Item label="Albums" value="albums" />

            <Md1Tabs.Item label="Artists" value="artists" />
          </Md1Tabs.List>
        </Md1Toolbar.Extension>
      </Md1Toolbar>

      <Md1Tabs.Panel class="md1-docs-nav-panel" value="songs">
        Every track in your library, newest first.
      </Md1Tabs.Panel>

      <Md1Tabs.Panel class="md1-docs-nav-panel" value="albums">
        Albums grouped by release, with the ones you play most at the top.
      </Md1Tabs.Panel>

      <Md1Tabs.Panel class="md1-docs-nav-panel" value="artists">
        Artists in alphabetical order.
      </Md1Tabs.Panel>
    </Md1Tabs>
  </div>
</template>

<style>
  /* A frame on the background colour, wide enough for three fixed tabs at their 160 dp tablet minimum. */
  .md1-docs-nav-frame {
    width: 100%;
    max-width: 600px;
    overflow: hidden;
    background: var(--md1-background, #FAFAFA);
  }

  .md1-docs-nav-panel {
    padding: var(--md1-spacing-2, 16px);
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-body-1-size, 14px);
    line-height: var(--md1-type-body-1-leading, 20px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
