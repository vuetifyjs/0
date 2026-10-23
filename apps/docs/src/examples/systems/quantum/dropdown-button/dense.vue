<script setup lang="ts">
  import { QuDropdownButton } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const zoom = shallowRef(100)
</script>

<template>
  <div class="quantum-docs-dropdown-stage">
    <QuDropdownButton v-model="zoom" dense>
      <QuDropdownButton.Item :value="50">50%</QuDropdownButton.Item>

      <QuDropdownButton.Item :value="100">100%</QuDropdownButton.Item>

      <QuDropdownButton.Item :value="150">150%</QuDropdownButton.Item>

      <QuDropdownButton.Item :value="200">200%</QuDropdownButton.Item>
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
