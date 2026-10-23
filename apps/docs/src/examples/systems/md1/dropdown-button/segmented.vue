<script setup lang="ts">
  import { Md1DropdownButton } from '@paper/md1'
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
  <div class="md1-docs-dropdown-stage">
    <Md1DropdownButton v-model="action" aria-label="Reply options" segmented @select="onSelect">
      <Md1DropdownButton.Item value="reply">Reply</Md1DropdownButton.Item>

      <Md1DropdownButton.Item value="all">Reply all</Md1DropdownButton.Item>

      <Md1DropdownButton.Item value="forward">Forward</Md1DropdownButton.Item>
    </Md1DropdownButton>

    <span v-if="sent" class="md1-docs-note" role="status">{{ sent }} sent</span>
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
