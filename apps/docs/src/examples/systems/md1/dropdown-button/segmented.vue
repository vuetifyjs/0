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
  <div class="md1-docs-dropdown-stage md1-docs-dropdown-column">
    <Md1DropdownButton v-model="action" aria-label="Reply options" segmented @select="onSelect">
      <Md1DropdownButton.Item value="reply">Reply</Md1DropdownButton.Item>

      <Md1DropdownButton.Item value="all">Reply all</Md1DropdownButton.Item>

      <Md1DropdownButton.Item value="forward">Forward</Md1DropdownButton.Item>
    </Md1DropdownButton>

    <p class="md1-docs-readout md1-docs-note" role="status">{{ sent ? `${sent} sent` : 'Nothing sent' }}</p>
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

  .md1-docs-note {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
