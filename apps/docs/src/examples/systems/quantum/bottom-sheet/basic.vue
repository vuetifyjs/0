<script setup lang="ts">
  import { QuBottomSheet, QuButton } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const chosen = shallowRef('')
</script>

<template>
  <div class="quantum-docs-screen quantum-docs-sheet-screen">
    <div class="quantum-docs-sheet-bar">
      <QuBottomSheet>
        <QuBottomSheet.Activator v-slot="{ attrs }">
          <QuButton v-bind="attrs" variant="raised">Open sheet</QuButton>
        </QuBottomSheet.Activator>

        <QuBottomSheet.Item icon="share" @click="chosen = 'Share'">Share</QuBottomSheet.Item>

        <QuBottomSheet.Item icon="link" @click="chosen = 'Get link'">Get link</QuBottomSheet.Item>

        <QuBottomSheet.Item icon="edit" @click="chosen = 'Edit name'">Edit name</QuBottomSheet.Item>

        <QuBottomSheet.Item icon="delete" @click="chosen = 'Delete collection'">Delete collection</QuBottomSheet.Item>
      </QuBottomSheet>

      <span v-if="chosen" class="quantum-docs-note" role="status">{{ chosen }}</span>
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
