<script setup lang="ts">
  import { Md1DropdownButton } from '@paper/md1'
  import { shallowRef } from 'vue'

  const zoom = shallowRef(100)
</script>

<template>
  <div class="md1-docs-dropdown-stage">
    <Md1DropdownButton v-model="zoom" dense>
      <Md1DropdownButton.Item :value="50">50%</Md1DropdownButton.Item>

      <Md1DropdownButton.Item :value="100">100%</Md1DropdownButton.Item>

      <Md1DropdownButton.Item :value="150">150%</Md1DropdownButton.Item>

      <Md1DropdownButton.Item :value="200">200%</Md1DropdownButton.Item>
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
