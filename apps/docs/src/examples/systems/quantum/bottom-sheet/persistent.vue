<script setup lang="ts">
  import { QuBottomSheet, QuButton } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const open = shallowRef(true)
  const playing = shallowRef(false)
</script>

<template>
  <div class="quantum-docs-screen quantum-docs-sheet-screen">
    <div class="quantum-docs-sheet-bar">
      <QuBottomSheet v-model="open" persistent :teleport="false">
        <QuBottomSheet.Activator v-slot="{ attrs }">
          <QuButton v-bind="attrs">{{ open ? 'Hide player' : 'Show player' }}</QuButton>
        </QuBottomSheet.Activator>

        <QuBottomSheet.Title>Now playing: Clair de lune</QuBottomSheet.Title>

        <QuBottomSheet.Item :icon="playing ? 'pause' : 'play-arrow'" @click="playing = !playing">
          {{ playing ? 'Pause' : 'Play' }}
        </QuBottomSheet.Item>

        <QuBottomSheet.Item icon="favorite-border">Add to favourites</QuBottomSheet.Item>
      </QuBottomSheet>

      <span class="quantum-docs-note" role="status">{{ playing ? 'Playing' : 'Paused' }}</span>
    </div>
  </div>
</template>

<style>
  .quantum-docs-sheet-screen {
    background: var(--quantum-background, #FAFAFA);
  }

  .quantum-docs-sheet-bar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--quantum-spacing-2, 16px);
    padding: var(--quantum-spacing-2, 16px);
  }

  .quantum-docs-note {
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-caption-size, 12px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
