<script setup lang="ts">
  import { Md1DropdownButton } from '@paper/md1'
  import { shallowRef } from 'vue'

  const font = shallowRef('roboto')
  const size = shallowRef(14)
</script>

<template>
  <div class="md1-docs-dropdown-stage">
    <Md1DropdownButton v-model="font" desktop>
      <Md1DropdownButton.Item value="roboto">Roboto</Md1DropdownButton.Item>

      <Md1DropdownButton.Item value="noto">Noto Sans</Md1DropdownButton.Item>

      <Md1DropdownButton.Item value="mono">Roboto Mono</Md1DropdownButton.Item>
    </Md1DropdownButton>

    <Md1DropdownButton v-model="size" dense desktop>
      <Md1DropdownButton.Item :value="12">12</Md1DropdownButton.Item>

      <Md1DropdownButton.Item :value="14">14</Md1DropdownButton.Item>

      <Md1DropdownButton.Item :value="16">16</Md1DropdownButton.Item>

      <Md1DropdownButton.Item :value="20">20</Md1DropdownButton.Item>
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
