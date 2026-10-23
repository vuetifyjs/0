<script setup lang="ts">
  import { QuTabs } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const tab = shallowRef('songs')
</script>

<template>
  <QuTabs v-model="tab">
    <QuTabs.List label="Library">
      <QuTabs.Item label="Songs" value="songs" />

      <QuTabs.Item label="Albums" value="albums" />

      <QuTabs.Item label="Artists" value="artists" />
    </QuTabs.List>

    <QuTabs.Panel class="quantum-docs-tabs-panel" value="songs">
      Every track in your library, newest first.
    </QuTabs.Panel>

    <QuTabs.Panel class="quantum-docs-tabs-panel" value="albums">
      Albums grouped by release, with the ones you play most at the top.
    </QuTabs.Panel>

    <QuTabs.Panel class="quantum-docs-tabs-panel" value="artists">
      Artists in alphabetical order.
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
