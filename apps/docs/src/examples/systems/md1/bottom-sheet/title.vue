<script setup lang="ts">
  import { Md1BottomSheet, Md1Button, Md1Divider } from '@paper/md1'
</script>

<template>
  <div class="md1-docs-screen md1-docs-sheet-screen">
    <div class="md1-docs-sheet-bar">
      <Md1BottomSheet>
        <Md1BottomSheet.Activator v-slot="{ attrs }">
          <Md1Button v-bind="attrs" variant="raised">Document options</Md1Button>
        </Md1BottomSheet.Activator>

        <Md1BottomSheet.Title>Quarterly report</Md1BottomSheet.Title>

        <Md1BottomSheet.Item icon="open-in-new">Open in new window</Md1BottomSheet.Item>

        <Md1BottomSheet.Item icon="file-download">Download</Md1BottomSheet.Item>

        <Md1BottomSheet.Item disabled icon="send">Send a copy</Md1BottomSheet.Item>

        <Md1Divider />

        <Md1BottomSheet.Item icon="info">Details</Md1BottomSheet.Item>

        <Md1BottomSheet.Item href="#help" icon="help">Help and feedback</Md1BottomSheet.Item>
      </Md1BottomSheet>
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
