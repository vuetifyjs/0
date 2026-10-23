<script setup lang="ts">
  import { QuToggleButtons } from '@paper/quantum'

  import { shallowRef } from 'vue'

  const view = shallowRef('grid')
  const layout = shallowRef('list')
</script>

<template>
  <div class="quantum-docs-stack">
    <QuToggleButtons v-model="view" label="View" mandatory>
      <QuToggleButtons.Item aria-label="Grid" icon="apps" value="grid" />

      <QuToggleButtons.Item aria-label="List" icon="reorder" value="list" />

      <QuToggleButtons.Item aria-label="Map" icon="place" value="map" />
    </QuToggleButtons>

    <QuToggleButtons v-model="layout" label="Layout" mandatory>
      <QuToggleButtons.Item icon="apps" value="grid">Grid</QuToggleButtons.Item>

      <QuToggleButtons.Item icon="reorder" value="list">List</QuToggleButtons.Item>

      <QuToggleButtons.Item icon="place" value="map">Map</QuToggleButtons.Item>
    </QuToggleButtons>
  </div>
</template>

<style>
  .quantum-docs-stack {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--quantum-spacing-2, 16px);
  }
</style>
