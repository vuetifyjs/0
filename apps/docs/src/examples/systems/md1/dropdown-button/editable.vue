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
  <div class="md1-docs-dropdown-stage md1-docs-dropdown-column">
    <Md1DropdownButton v-model="size" editable label="Font size" @select="onSelect">
      <Md1DropdownButton.Item v-for="item in sizes" :key="item" :value="item">{{ item }}</Md1DropdownButton.Item>
    </Md1DropdownButton>

    <span class="md1-docs-note md1-docs-dropdown-sample" :style="{ fontSize: `${size}px` }">Sample text</span>

    <p class="md1-docs-readout md1-docs-note" role="status">{{ applied ? `Applied ${applied} pt` : 'Pick a size, then press it or type one to apply' }}</p>
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

  /*
   * The button on top and its readout below, each centred on its own, so the
   * readout appearing or changing never moves the button.
   */
  .md1-docs-dropdown-stage.md1-docs-dropdown-column {
    flex-direction: column;
    flex-wrap: nowrap;
  }

  /* One line tall enough for the largest size, so the sample growing never moves the button above it. */
  .md1-docs-dropdown-sample {
    line-height: 48px;
  }

  .md1-docs-note {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
