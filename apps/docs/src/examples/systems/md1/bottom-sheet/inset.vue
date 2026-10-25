<script setup lang="ts">
  import { Md1BottomSheet, Md1Button } from '@paper/md1'
  import { shallowRef } from 'vue'

  const open = shallowRef(true)
  const chosen = shallowRef('')
</script>

<template>
  <div class="md1-docs-screen md1-docs-sheet-screen">
    <div class="md1-docs-sheet-bar">
      <Md1BottomSheet v-model="open" inset persistent :teleport="false">
        <Md1BottomSheet.Activator v-slot="{ attrs }">
          <Md1Button v-bind="attrs">{{ open ? 'Hide details' : 'Show details' }}</Md1Button>
        </Md1BottomSheet.Activator>

        <Md1BottomSheet.Title>Harbour Street Bakery</Md1BottomSheet.Title>

        <Md1BottomSheet.Item icon="near-me" @click="chosen = 'Directions'">Directions</Md1BottomSheet.Item>

        <Md1BottomSheet.Item icon="phone" @click="chosen = 'Call'">Call</Md1BottomSheet.Item>

        <Md1BottomSheet.Item icon="share" @click="chosen = 'Share'">Share</Md1BottomSheet.Item>
      </Md1BottomSheet>

      <span class="md1-docs-note" role="status">{{ chosen || 'Nothing chosen' }}</span>
    </div>
  </div>
</template>

<style>
  .md1-docs-sheet-screen {
    background: var(--md1-background, #FAFAFA);
  }

  .md1-docs-sheet-bar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--md1-spacing-2, 16px);
    padding: var(--md1-spacing-2, 16px);
  }

  .md1-docs-note {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
