<script setup lang="ts">
  import { Md1Button, Md1Toolbar } from '@paper/md1'

  const messages = Array.from({ length: 24 }, (_, index) => `Message ${index + 1}: scroll down and the bar leaves with the content; scroll up and it comes back.`)
</script>

<template>
  <div class="md1-docs-screen md1-docs-toolbar-screen">
    <Md1Toolbar app-bar scroll="hide">
      <Md1Toolbar.Nav />

      <Md1Toolbar.Title>Inbox</Md1Toolbar.Title>

      <Md1Toolbar.Actions>
        <Md1Button aria-label="Search" icon="search" />
      </Md1Toolbar.Actions>
    </Md1Toolbar>

    <div class="md1-docs-toolbar-content">
      <p v-for="message in messages" :key="message" class="md1-docs-toolbar-text">{{ message }}</p>
    </div>
  </div>
</template>

<style>
  .md1-docs-toolbar-screen {
    background: var(--md1-background, #FAFAFA);
  }

  .md1-docs-toolbar-content {
    box-sizing: border-box;
    height: 100%;
    padding: calc(var(--md1-increment, 56px) + var(--md1-spacing-2, 16px)) var(--md1-spacing-2, 16px) var(--md1-spacing-2, 16px);
    overflow-y: auto;
  }

  .md1-docs-toolbar-text {
    margin: 0 0 var(--md1-spacing-2, 16px);
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-body-1-size, 14px);
    line-height: var(--md1-type-body-1-leading, 20px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
