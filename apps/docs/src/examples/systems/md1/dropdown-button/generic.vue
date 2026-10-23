<script setup lang="ts">
  import { Md1DropdownButton } from '@paper/md1'
  import { shallowRef } from 'vue'

  const page = shallowRef<string>()

  // The generic dropdown shows no state: the choice navigates, so the model stays empty.
  function onOpen (value: unknown) {
    page.value = String(value)
  }
</script>

<template>
  <div class="md1-docs-dropdown-stage">
    <Md1DropdownButton aria-label="Settings" :model-value="undefined" @update:model-value="onOpen">
      <Md1DropdownButton.Item value="Account">Account</Md1DropdownButton.Item>

      <Md1DropdownButton.Item value="Notifications">Notifications</Md1DropdownButton.Item>

      <Md1DropdownButton.Item value="Privacy">Privacy</Md1DropdownButton.Item>
    </Md1DropdownButton>

    <span v-if="page" class="md1-docs-note" role="status">Opened {{ page }} settings</span>
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

  .md1-docs-note {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
