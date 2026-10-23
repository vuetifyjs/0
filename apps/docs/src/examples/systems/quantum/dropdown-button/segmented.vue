<script setup lang="ts">
  import { QuDropdownButton } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const action = shallowRef('reply')
  const sent = shallowRef<string>()

  const labels: Record<string, string> = {
    reply: 'Reply',
    all: 'Reply all',
    forward: 'Forward',
  }

  function onSelect (value: unknown) {
    sent.value = labels[String(value)]
  }
</script>

<template>
  <div class="quantum-docs-dropdown-stage">
    <QuDropdownButton v-model="action" aria-label="Reply options" segmented @select="onSelect">
      <QuDropdownButton.Item value="reply">Reply</QuDropdownButton.Item>

      <QuDropdownButton.Item value="all">Reply all</QuDropdownButton.Item>

      <QuDropdownButton.Item value="forward">Forward</QuDropdownButton.Item>
    </QuDropdownButton>

    <span v-if="sent" class="quantum-docs-note" role="status">{{ sent }} sent</span>
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
