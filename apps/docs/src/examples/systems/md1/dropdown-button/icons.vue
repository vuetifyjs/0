<script setup lang="ts">
  import { Md1DropdownButton } from '@paper/md1'
  import { shallowRef } from 'vue'

  const view = shallowRef('grid')
</script>

<template>
  <div class="md1-docs-dropdown-stage">
    <Md1DropdownButton v-model="view">
      <Md1DropdownButton.Item icon="apps" value="grid">Grid</Md1DropdownButton.Item>

      <Md1DropdownButton.Item icon="reorder" value="list">List</Md1DropdownButton.Item>

      <Md1DropdownButton.Item icon="event" value="calendar">Calendar</Md1DropdownButton.Item>
    </Md1DropdownButton>
  </div>
</template>

<style>
  .md1-docs-dropdown-stage {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: var(--md1-spacing-3, 24px);
    min-block-size: 240px;
    padding-block-start: var(--md1-spacing-2, 16px);
  }
</style>
