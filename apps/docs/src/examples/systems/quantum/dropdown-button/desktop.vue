<script setup lang="ts">
  import { QuDropdownButton } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const font = shallowRef('roboto')
  const size = shallowRef(14)
</script>

<template>
  <div class="quantum-docs-dropdown-stage">
    <QuDropdownButton v-model="font" desktop>
      <QuDropdownButton.Item value="roboto">Roboto</QuDropdownButton.Item>

      <QuDropdownButton.Item value="noto">Noto Sans</QuDropdownButton.Item>

      <QuDropdownButton.Item value="mono">Roboto Mono</QuDropdownButton.Item>
    </QuDropdownButton>

    <QuDropdownButton v-model="size" dense desktop>
      <QuDropdownButton.Item :value="12">12</QuDropdownButton.Item>

      <QuDropdownButton.Item :value="14">14</QuDropdownButton.Item>

      <QuDropdownButton.Item :value="16">16</QuDropdownButton.Item>

      <QuDropdownButton.Item :value="20">20</QuDropdownButton.Item>
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
