<script setup lang="ts">
  import { QuBottomSheet, QuButton } from '@paper/quantum'
</script>

<template>
  <div class="quantum-docs-screen quantum-docs-sheet-screen">
    <div class="quantum-docs-sheet-bar">
      <QuBottomSheet grid>
        <QuBottomSheet.Activator v-slot="{ attrs }">
          <QuButton v-bind="attrs" variant="raised">Share photo</QuButton>
        </QuBottomSheet.Activator>

        <QuBottomSheet.Title>Share with</QuBottomSheet.Title>

        <QuBottomSheet.Item icon="email">Email</QuBottomSheet.Item>

        <QuBottomSheet.Item icon="send">Messages</QuBottomSheet.Item>

        <QuBottomSheet.Item icon="cloud-upload">Drive</QuBottomSheet.Item>

        <QuBottomSheet.Item icon="bookmark">Keep</QuBottomSheet.Item>

        <QuBottomSheet.Item icon="link">Copy link</QuBottomSheet.Item>

        <QuBottomSheet.Item icon="phone">Phone</QuBottomSheet.Item>
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
