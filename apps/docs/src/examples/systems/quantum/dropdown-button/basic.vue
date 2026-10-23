<script setup lang="ts">
  import { QuDropdownButton } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const style = shallowRef('normal')
</script>

<template>
  <div class="quantum-docs-dropdown-stage">
    <QuDropdownButton v-model="style">
      <QuDropdownButton.Item value="normal">Normal text</QuDropdownButton.Item>

      <QuDropdownButton.Item value="title">Title</QuDropdownButton.Item>

      <QuDropdownButton.Item value="subheading">Subheading</QuDropdownButton.Item>

      <QuDropdownButton.Item value="caption">Caption</QuDropdownButton.Item>
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
