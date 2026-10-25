<script setup lang="ts">
  import { Md1DropdownButton } from '@paper/md1'
  import { shallowRef } from 'vue'

  const sizes = [8, 9, 10, 11, 12, 14, 18, 24, 30, 36]

  const size = shallowRef<unknown>(11)
  const applied = shallowRef<unknown>()

  function onSelect (value: unknown) {
    applied.value = value
  }
</script>

<template>
  <div class="md1-docs-dropdown-stage">
    <Md1DropdownButton v-model="size" editable label="Font size" @select="onSelect">
      <Md1DropdownButton.Item v-for="item in sizes" :key="item" :value="item">{{ item }}</Md1DropdownButton.Item>
    </Md1DropdownButton>

    <span class="md1-docs-note" :style="{ fontSize: `${size}px` }">Sample text</span>

    <span v-if="applied" class="md1-docs-note" role="status">Applied {{ applied }} pt</span>
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

  .md1-docs-note {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
