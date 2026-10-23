<script setup lang="ts">
  import { QuDropdownButton } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const view = shallowRef('grid')
</script>

<template>
  <div class="quantum-docs-dropdown-stage">
    <QuDropdownButton v-model="view">
      <QuDropdownButton.Item icon="apps" value="grid">Grid</QuDropdownButton.Item>

      <QuDropdownButton.Item icon="reorder" value="list">List</QuDropdownButton.Item>

      <QuDropdownButton.Item icon="event" value="calendar">Calendar</QuDropdownButton.Item>
    </QuDropdownButton>
  </div>
</template>

<style>
  .quantum-docs-dropdown-stage {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: var(--quantum-spacing-3, 24px);
    min-block-size: 240px;
    padding-block-start: var(--quantum-spacing-2, 16px);
  }
</style>
