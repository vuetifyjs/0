<script setup lang="ts">
  import { Md1Button, Md1Toolbar } from '@paper/md1'

  const paragraphs = Array.from({ length: 24 }, (_, index) => `Paragraph ${index + 1}: the flexible space shrinks as you scroll until only the toolbar remains, and the title shrinks to 20 sp with it.`)
</script>

<template>
  <div class="md1-docs-screen md1-docs-toolbar-screen">
    <Md1Toolbar app-bar scroll="collapse">
      <Md1Toolbar.Nav icon="up" />

      <Md1Toolbar.Actions>
        <Md1Button aria-label="Share" icon="share" />
      </Md1Toolbar.Actions>

      <Md1Toolbar.Extension>
        <Md1Toolbar.Title>Recipes</Md1Toolbar.Title>
      </Md1Toolbar.Extension>
    </Md1Toolbar>

    <div class="md1-docs-toolbar-collapse-content">
      <p v-for="paragraph in paragraphs" :key="paragraph" class="md1-docs-toolbar-text">{{ paragraph }}</p>
    </div>
  </div>
</template>

<style>
  .md1-docs-toolbar-screen {
    background: var(--md1-background, #FAFAFA);
  }

  .md1-docs-toolbar-collapse-content {
    box-sizing: border-box;
    height: 100%;
    padding: calc(var(--md1-increment, 56px) * 2 + var(--md1-spacing-2, 16px)) var(--md1-spacing-2, 16px) var(--md1-spacing-2, 16px);
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
