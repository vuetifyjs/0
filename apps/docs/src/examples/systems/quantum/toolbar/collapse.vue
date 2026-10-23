<script setup lang="ts">
  import { QuButton, QuToolbar } from '@paper/quantum'

  const paragraphs = Array.from({ length: 24 }, (_, index) => `Paragraph ${index + 1}: the flexible space shrinks as you scroll until only the toolbar remains, and the title shrinks to 20 sp with it.`)
</script>

<template>
  <div class="quantum-docs-screen quantum-docs-toolbar-screen">
    <QuToolbar app-bar scroll="collapse">
      <QuToolbar.Nav icon="up" />

      <QuToolbar.Actions>
        <QuButton aria-label="Share" icon="share" />
      </QuToolbar.Actions>

      <QuToolbar.Extension>
        <QuToolbar.Title>Recipes</QuToolbar.Title>
      </QuToolbar.Extension>
    </QuToolbar>

    <div class="quantum-docs-toolbar-collapse-content">
      <p v-for="paragraph in paragraphs" :key="paragraph" class="quantum-docs-toolbar-text">{{ paragraph }}</p>
    </div>
  </div>
</template>

<style>
  .quantum-docs-toolbar-screen {
    background: var(--quantum-background, #FAFAFA);
  }

  .quantum-docs-toolbar-collapse-content {
    box-sizing: border-box;
    height: 100%;
    padding: calc(var(--quantum-increment, 56px) * 2 + var(--quantum-spacing-2, 16px)) var(--quantum-spacing-2, 16px) var(--quantum-spacing-2, 16px);
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
