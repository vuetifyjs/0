<script setup lang="ts">
  import { Md1Button, Md1Toolbar } from '@paper/md1'
</script>

<template>
  <div class="md1-docs-screen md1-docs-toolbar-screen">
    <div class="md1-docs-toolbar-bottom-content">
      <p class="md1-docs-toolbar-text">A bottom toolbar holds actions for the screen above it, and clings to the top of the on-screen keyboard while one is open.</p>
    </div>

    <Md1Toolbar position="bottom">
      <Md1Toolbar.Actions aria-label="Message">
        <Md1Button aria-label="Attach" icon="cloud-upload" />

        <Md1Button aria-label="Insert photo" icon="photo" />

        <Md1Button aria-label="Send" icon="send" />
      </Md1Toolbar.Actions>
    </Md1Toolbar>
  </div>
</template>

<style>
  .md1-docs-toolbar-screen {
    background: var(--md1-background, #FAFAFA);
  }

  .md1-docs-toolbar-bottom-content {
    box-sizing: border-box;
    height: 100%;
    padding: var(--md1-spacing-2, 16px) var(--md1-spacing-2, 16px) calc(var(--md1-increment, 56px) + var(--md1-spacing-2, 16px));
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
