<script setup lang="ts">
  import { QuButton, QuToolbar } from '@paper/quantum'

  const messages = Array.from({ length: 24 }, (_, index) => `Message ${index + 1}: scroll down and the bar leaves with the content; scroll up and it comes back.`)
</script>

<template>
  <div class="quantum-docs-screen quantum-docs-toolbar-screen">
    <QuToolbar app-bar scroll="hide">
      <QuToolbar.Nav />

      <QuToolbar.Title>Inbox</QuToolbar.Title>

      <QuToolbar.Actions>
        <QuButton aria-label="Search" icon="search" />
      </QuToolbar.Actions>
    </QuToolbar>

    <div class="quantum-docs-toolbar-content">
      <p v-for="message in messages" :key="message" class="quantum-docs-toolbar-text">{{ message }}</p>
    </div>
  </div>
</template>

<style>
  .quantum-docs-toolbar-screen {
    background: var(--quantum-background, #FAFAFA);
  }

  .quantum-docs-toolbar-content {
    box-sizing: border-box;
    height: 100%;
    padding: calc(var(--quantum-increment, 56px) + var(--quantum-spacing-2, 16px)) var(--quantum-spacing-2, 16px) var(--quantum-spacing-2, 16px);
    overflow-y: auto;
  }

  .quantum-docs-toolbar-text {
    margin: 0 0 var(--quantum-spacing-2, 16px);
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-body-1-size, 14px);
    line-height: var(--quantum-type-body-1-leading, 20px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
