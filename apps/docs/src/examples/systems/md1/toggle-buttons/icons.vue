<script setup lang="ts">
  import { Md1ToggleButtons } from '@paper/md1'

  import { shallowRef } from 'vue'

  const view = shallowRef('grid')
  const layout = shallowRef('list')
</script>

<template>
  <div class="md1-docs-stack">
    <Md1ToggleButtons v-model="view" label="View" mandatory>
      <Md1ToggleButtons.Item aria-label="Grid" icon="apps" value="grid" />

      <Md1ToggleButtons.Item aria-label="List" icon="reorder" value="list" />

      <Md1ToggleButtons.Item aria-label="Map" icon="place" value="map" />
    </Md1ToggleButtons>

    <Md1ToggleButtons v-model="layout" label="Layout" mandatory>
      <Md1ToggleButtons.Item icon="apps" value="grid">Grid</Md1ToggleButtons.Item>

      <Md1ToggleButtons.Item icon="reorder" value="list">List</Md1ToggleButtons.Item>

      <Md1ToggleButtons.Item icon="place" value="map">Map</Md1ToggleButtons.Item>
    </Md1ToggleButtons>
  </div>
</template>

<style>
  .md1-docs-stack {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--md1-spacing-2, 16px);
  }
</style>
