<script setup lang="ts">
  import { QuBottomSheet, QuButton, QuDivider } from '@paper/quantum'
</script>

<template>
  <div class="quantum-docs-screen quantum-docs-sheet-screen">
    <div class="quantum-docs-sheet-bar">
      <QuBottomSheet>
        <QuBottomSheet.Activator v-slot="{ attrs }">
          <QuButton v-bind="attrs" variant="raised">Document options</QuButton>
        </QuBottomSheet.Activator>

        <QuBottomSheet.Title>Quarterly report</QuBottomSheet.Title>

        <QuBottomSheet.Item icon="open-in-new">Open in new window</QuBottomSheet.Item>

        <QuBottomSheet.Item icon="file-download">Download</QuBottomSheet.Item>

        <QuBottomSheet.Item disabled icon="send">Send a copy</QuBottomSheet.Item>

        <QuDivider />

        <QuBottomSheet.Item icon="info">Details</QuBottomSheet.Item>

        <QuBottomSheet.Item href="#help" icon="help">Help and feedback</QuBottomSheet.Item>
      </QuBottomSheet>
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
