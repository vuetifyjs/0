<script setup lang="ts">
  import { QuDropdownButton } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const page = shallowRef<string>()

  // The generic dropdown shows no state: the choice navigates, so the model stays empty.
  function onOpen (value: unknown) {
    page.value = String(value)
  }
</script>

<template>
  <div class="quantum-docs-dropdown-stage">
    <QuDropdownButton aria-label="Settings" :model-value="undefined" @update:model-value="onOpen">
      <QuDropdownButton.Item value="Account">Account</QuDropdownButton.Item>

      <QuDropdownButton.Item value="Notifications">Notifications</QuDropdownButton.Item>

      <QuDropdownButton.Item value="Privacy">Privacy</QuDropdownButton.Item>
    </QuDropdownButton>

    <span v-if="page" class="quantum-docs-note" role="status">Opened {{ page }} settings</span>
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

  .quantum-docs-note {
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-caption-size, 12px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
