<script setup lang="ts">
  import { QuDropdownButton } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const edit = shallowRef('paste')
  const locked = shallowRef('normal')
</script>

<template>
  <div class="quantum-docs-dropdown-stage">
    <QuDropdownButton v-model="edit">
      <QuDropdownButton.Item value="undo">Undo</QuDropdownButton.Item>

      <QuDropdownButton.Item disabled value="redo">Redo</QuDropdownButton.Item>

      <QuDropdownButton.Item disabled value="cut">Cut</QuDropdownButton.Item>

      <QuDropdownButton.Item value="paste">Paste</QuDropdownButton.Item>
    </QuDropdownButton>

    <QuDropdownButton v-model="locked" disabled>
      <QuDropdownButton.Item value="normal">Normal text</QuDropdownButton.Item>

      <QuDropdownButton.Item value="title">Title</QuDropdownButton.Item>
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
