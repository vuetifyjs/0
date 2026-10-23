<script setup lang="ts">
  import { Md1DropdownButton } from '@paper/md1'
  import { shallowRef } from 'vue'

  const edit = shallowRef('paste')
  const locked = shallowRef('normal')
</script>

<template>
  <div class="md1-docs-dropdown-stage">
    <Md1DropdownButton v-model="edit">
      <Md1DropdownButton.Item value="undo">Undo</Md1DropdownButton.Item>

      <Md1DropdownButton.Item disabled value="redo">Redo</Md1DropdownButton.Item>

      <Md1DropdownButton.Item disabled value="cut">Cut</Md1DropdownButton.Item>

      <Md1DropdownButton.Item value="paste">Paste</Md1DropdownButton.Item>
    </Md1DropdownButton>

    <Md1DropdownButton v-model="locked" disabled>
      <Md1DropdownButton.Item value="normal">Normal text</Md1DropdownButton.Item>

      <Md1DropdownButton.Item value="title">Title</Md1DropdownButton.Item>
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
