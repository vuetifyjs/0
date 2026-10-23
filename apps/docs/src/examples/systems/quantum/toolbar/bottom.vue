<script setup lang="ts">
  import { QuButton, QuToolbar } from '@paper/quantum'
</script>

<template>
  <div class="quantum-docs-screen quantum-docs-toolbar-screen">
    <div class="quantum-docs-toolbar-bottom-content">
      <p class="quantum-docs-toolbar-text">A bottom toolbar holds actions for the screen above it, and clings to the top of the on-screen keyboard while one is open.</p>
    </div>

    <QuToolbar position="bottom">
      <QuToolbar.Actions aria-label="Message">
        <QuButton aria-label="Attach" icon="cloud-upload" />

        <QuButton aria-label="Insert photo" icon="photo" />

        <QuButton aria-label="Send" icon="send" />
      </QuToolbar.Actions>
    </QuToolbar>
  </div>
</template>

<style>
  .quantum-docs-toolbar-screen {
    background: var(--quantum-background, #FAFAFA);
  }

  .quantum-docs-toolbar-bottom-content {
    box-sizing: border-box;
    height: 100%;
    padding: var(--quantum-spacing-2, 16px) var(--quantum-spacing-2, 16px) calc(var(--quantum-increment, 56px) + var(--quantum-spacing-2, 16px));
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
