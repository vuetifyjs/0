<script setup lang="ts">
  import { QuTabs } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const tab = shallowRef('recents')
</script>

<template>
  <QuTabs v-model="tab">
    <QuTabs.List label="Contacts">
      <QuTabs.Item icon="phone" label="Recents" value="recents" />

      <QuTabs.Item icon="favorite" label="Favorites" value="favorites" />

      <QuTabs.Item icon="place" label="Nearby" value="nearby" />
    </QuTabs.List>

    <QuTabs.Panel class="quantum-docs-tabs-panel" value="recents">
      Calls from the last seven days.
    </QuTabs.Panel>

    <QuTabs.Panel class="quantum-docs-tabs-panel" value="favorites">
      The people you starred.
    </QuTabs.Panel>

    <QuTabs.Panel class="quantum-docs-tabs-panel" value="nearby">
      Contacts who share their location with you.
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
