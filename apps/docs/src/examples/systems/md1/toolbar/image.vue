<script setup lang="ts">
  import { Md1Button, Md1Toolbar } from '@paper/md1'

  const paragraphs = Array.from({ length: 24 }, (_, index) => `Paragraph ${index + 1}: the content pushes the image up; once the space is gone the image takes the primary tint.`)
</script>

<template>
  <div class="md1-docs-screen md1-docs-toolbar-screen md1-docs-toolbar-image-screen">
    <Md1Toolbar app-bar scroll="collapse">
      <Md1Toolbar.Nav icon="up" />

      <Md1Toolbar.Actions>
        <Md1Button aria-label="Favorite" icon="favorite-border" />
      </Md1Toolbar.Actions>

      <Md1Toolbar.Extension image="https://picsum.photos/seed/md1-toolbar-coast/800/600" ratio="16:9">
        <Md1Toolbar.Title>Workspace</Md1Toolbar.Title>
      </Md1Toolbar.Extension>
    </Md1Toolbar>

    <div class="md1-docs-toolbar-image-content">
      <div aria-hidden="true" class="md1-docs-toolbar-image-spacer" />

      <p v-for="paragraph in paragraphs" :key="paragraph" class="md1-docs-toolbar-text">{{ paragraph }}</p>
    </div>
  </div>
</template>

<style>
  .md1-docs-toolbar-screen {
    background: var(--md1-background, #FAFAFA);
  }

  /* A 16:9 bar fills most of the standard 360 px screen; this one is taller so content shows under it. */
  .md1-docs-screen.md1-docs-toolbar-image-screen {
    height: 520px;
  }

  .md1-docs-toolbar-image-content {
    box-sizing: border-box;
    height: 100%;
    padding: 0 var(--md1-spacing-2, 16px) var(--md1-spacing-2, 16px);
    overflow-y: auto;
  }

  /* Leaves room for the 16:9 bar: the scroller is as wide as the bar. */
  .md1-docs-toolbar-image-spacer {
    aspect-ratio: 16 / 9;
    margin: 0 calc(-1 * var(--md1-spacing-2, 16px)) var(--md1-spacing-2, 16px);
  }

  .md1-docs-toolbar-text {
    margin: 0 0 var(--md1-spacing-2, 16px);
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-body-1-size, 14px);
    line-height: var(--md1-type-body-1-leading, 20px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
