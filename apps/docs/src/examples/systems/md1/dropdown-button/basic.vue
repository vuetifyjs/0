<script setup lang="ts">
  import { Md1DropdownButton } from '@paper/md1'
  import { shallowRef } from 'vue'

  const style = shallowRef('normal')
</script>

<template>
  <div class="md1-docs-dropdown-stage">
    <Md1DropdownButton v-model="style">
      <Md1DropdownButton.Item value="normal">Normal text</Md1DropdownButton.Item>

      <Md1DropdownButton.Item value="title">Title</Md1DropdownButton.Item>

      <Md1DropdownButton.Item value="subheading">Subheading</Md1DropdownButton.Item>

      <Md1DropdownButton.Item value="caption">Caption</Md1DropdownButton.Item>
    </Md1DropdownButton>
  </div>
</template>

<style>
  .md1-docs-dropdown-stage {
    display: flex;
    flex-wrap: wrap;
    place-content: center;
    align-items: center;
    gap: var(--md1-spacing-3, 24px);
    min-block-size: 240px;
  }
</style>
