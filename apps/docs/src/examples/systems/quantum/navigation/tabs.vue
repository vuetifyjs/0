<script setup lang="ts">
  import { QuTabs, QuToolbar } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const tab = shallowRef('songs')
</script>

<template>
  <div class="quantum-docs-nav-frame">
    <QuTabs v-model="tab">
      <QuToolbar variant="primary">
        <QuToolbar.Nav />

        <QuToolbar.Title>Music</QuToolbar.Title>

        <QuToolbar.Extension>
          <QuTabs.List label="Library">
            <QuTabs.Item label="Songs" value="songs" />

            <QuTabs.Item label="Albums" value="albums" />

            <QuTabs.Item label="Artists" value="artists" />
          </QuTabs.List>
        </QuToolbar.Extension>
      </QuToolbar>

      <QuTabs.Panel class="quantum-docs-nav-panel" value="songs">
        Every track in your library, newest first.
      </QuTabs.Panel>

      <QuTabs.Panel class="quantum-docs-nav-panel" value="albums">
        Albums grouped by release, with the ones you play most at the top.
      </QuTabs.Panel>

      <QuTabs.Panel class="quantum-docs-nav-panel" value="artists">
        Artists in alphabetical order.
      </QuTabs.Panel>
    </QuTabs>
  </div>
</template>

<style>
  /* A frame on the background colour, wide enough for three fixed tabs at their 160 dp tablet minimum. */
  .quantum-docs-nav-frame {
    width: 100%;
    max-width: 600px;
    overflow: hidden;
    background: var(--quantum-background, #FAFAFA);
  }

  .quantum-docs-nav-panel {
    padding: var(--quantum-spacing-2, 16px);
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-body-1-size, 14px);
    line-height: var(--quantum-type-body-1-leading, 20px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
