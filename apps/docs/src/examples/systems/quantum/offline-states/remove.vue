<script setup lang="ts">
  import { QuButton, QuList } from '@paper/quantum'
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
  <div class="quantum-docs-offline-sheet">
    <p class="quantum-docs-offline-summary" role="status">Downloads use {{ used }} MB on this device</p>

    <QuList :lines="2">
      <QuList.Item v-for="item in downloads" :key="item.id">
        <QuList.Content>
          <QuList.Primary>{{ item.title }}</QuList.Primary>

          <QuList.Secondary>Frees {{ item.size }} MB</QuList.Secondary>
        </QuList.Content>

        <QuList.Action>
          <QuButton :aria-label="`Remove ${item.title}, frees ${item.size} MB`" class="quantum-docs-offline-action" icon="delete" @click="onRemove(item.id)" />
        </QuList.Action>
      </QuList.Item>
    </QuList>
  </div>
</template>

<style>
  .quantum-docs-offline-sheet {
    box-sizing: border-box;
    width: 100%;
    max-width: 400px;
    background: var(--quantum-surface, #FFFFFF);
    border-radius: var(--quantum-radius, 2px);
    box-shadow: var(--quantum-elevation-2);
  }

  /* A list's secondary action is an icon in the active icon ink, not an accent-coloured flat button. */
  .quantum-docs-offline-action.quantum-button[data-solo]:not([data-disabled]) {
    color: var(--quantum-icon-active, rgba(0, 0, 0, 0.54));
  }

  .quantum-docs-offline-summary {
    margin: 0;
    padding: var(--quantum-spacing-2, 16px) var(--quantum-spacing-2, 16px) 0;
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-caption-size, 12px);
    letter-spacing: var(--quantum-type-caption-tracking, 0.02em);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
