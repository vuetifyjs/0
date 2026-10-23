<script setup lang="ts">
  import { Md1Button, Md1List } from '@paper/md1'
  import { ref, toRef } from 'vue'

  const downloads = ref([
    { id: 1, title: 'Episode 10: Fog over the bay', size: 41 },
    { id: 2, title: 'Episode 11: Night trains', size: 37 },
    { id: 3, title: 'Episode 12: The long way round', size: 32 },
  ])

  const used = toRef(() => downloads.value.reduce((total, item) => total + item.size, 0))

  function onRemove (id: number) {
    downloads.value = downloads.value.filter(item => item.id !== id)
  }
</script>

<template>
  <div class="md1-docs-offline-sheet">
    <p class="md1-docs-offline-summary" role="status">Downloads use {{ used }} MB on this device</p>

    <Md1List :lines="2">
      <Md1List.Item v-for="item in downloads" :key="item.id">
        <Md1List.Content>
          <Md1List.Primary>{{ item.title }}</Md1List.Primary>

          <Md1List.Secondary>Frees {{ item.size }} MB</Md1List.Secondary>
        </Md1List.Content>

        <Md1List.Action>
          <Md1Button :aria-label="`Remove ${item.title}, frees ${item.size} MB`" class="md1-docs-offline-action" icon="delete" @click="onRemove(item.id)" />
        </Md1List.Action>
      </Md1List.Item>
    </Md1List>
  </div>
</template>

<style>
  .md1-docs-offline-sheet {
    box-sizing: border-box;
    width: 100%;
    max-width: 400px;
    background: var(--md1-surface, #FFFFFF);
    border-radius: var(--md1-radius, 2px);
    box-shadow: var(--md1-elevation-2);
  }

  /* A list's secondary action is an icon in the active icon ink, not an accent-coloured flat button. */
  .md1-docs-offline-action.md1-button[data-solo]:not([data-disabled]) {
    color: var(--md1-icon-active, rgba(0, 0, 0, 0.54));
  }

  .md1-docs-offline-summary {
    margin: 0;
    padding: var(--md1-spacing-2, 16px) var(--md1-spacing-2, 16px) 0;
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    letter-spacing: var(--md1-type-caption-tracking, 0.02em);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
