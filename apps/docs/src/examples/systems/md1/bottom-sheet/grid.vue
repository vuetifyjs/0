<script setup lang="ts">
  import { Md1BottomSheet, Md1Button } from '@paper/md1'
</script>

<template>
  <div class="md1-docs-screen md1-docs-sheet-screen">
    <div class="md1-docs-sheet-bar">
      <Md1BottomSheet grid>
        <Md1BottomSheet.Activator v-slot="{ attrs }">
          <Md1Button v-bind="attrs" variant="raised">Share photo</Md1Button>
        </Md1BottomSheet.Activator>

        <Md1BottomSheet.Title>Share with</Md1BottomSheet.Title>

        <Md1BottomSheet.Item icon="email">Email</Md1BottomSheet.Item>

        <Md1BottomSheet.Item icon="send">Messages</Md1BottomSheet.Item>

        <Md1BottomSheet.Item icon="cloud-upload">Drive</Md1BottomSheet.Item>

        <Md1BottomSheet.Item icon="bookmark">Keep</Md1BottomSheet.Item>

        <Md1BottomSheet.Item icon="link">Copy link</Md1BottomSheet.Item>

        <Md1BottomSheet.Item icon="phone">Phone</Md1BottomSheet.Item>
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
