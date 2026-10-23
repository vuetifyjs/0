<script setup lang="ts">
  import { QuButton, QuToolbar } from '@paper/quantum'

  const paragraphs = Array.from({ length: 24 }, (_, index) => `Paragraph ${index + 1}: the content pushes the image up; once the space is gone the image takes the primary tint.`)
</script>

<template>
  <div class="quantum-docs-screen quantum-docs-toolbar-screen quantum-docs-toolbar-image-screen">
    <QuToolbar app-bar scroll="collapse">
      <QuToolbar.Nav icon="up" />

      <QuToolbar.Actions>
        <QuButton aria-label="Favorite" icon="favorite-border" />
      </QuToolbar.Actions>

      <QuToolbar.Extension image="https://picsum.photos/seed/quantum-toolbar-coast/800/600" ratio="16:9">
        <QuToolbar.Title>Workspace</QuToolbar.Title>
      </QuToolbar.Extension>
    </QuToolbar>

    <div class="quantum-docs-toolbar-image-content">
      <div aria-hidden="true" class="quantum-docs-toolbar-image-spacer" />

      <p v-for="paragraph in paragraphs" :key="paragraph" class="quantum-docs-toolbar-text">{{ paragraph }}</p>
    </div>
  </div>
</template>

<style>
  .quantum-docs-toolbar-screen {
    background: var(--quantum-background, #FAFAFA);
  }

  /* A 16:9 bar fills most of the standard 360 px screen; this one is taller so content shows under it. */
  .quantum-docs-screen.quantum-docs-toolbar-image-screen {
    height: 520px;
  }

  .quantum-docs-toolbar-image-content {
    box-sizing: border-box;
    height: 100%;
    padding: 0 var(--quantum-spacing-2, 16px) var(--quantum-spacing-2, 16px);
    overflow-y: auto;
  }

  /* Leaves room for the 16:9 bar: the scroller is as wide as the bar. */
  .quantum-docs-toolbar-image-spacer {
    aspect-ratio: 16 / 9;
    margin: 0 calc(-1 * var(--quantum-spacing-2, 16px)) var(--quantum-spacing-2, 16px);
  }

  .quantum-docs-toolbar-text {
    margin: 0 0 var(--quantum-spacing-2, 16px);
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-body-1-size, 14px);
    line-height: var(--quantum-type-body-1-leading, 20px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
