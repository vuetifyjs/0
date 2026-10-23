<script setup lang="ts">
  import { Md1Button } from '@paper/md1'
  import { useTemplateRef } from 'vue'

  const sentence = useTemplateRef<HTMLElement>('sentence')

  function onSelect () {
    const selection = window.getSelection()

    if (!selection || !sentence.value) return

    const range = document.createRange()

    range.selectNodeContents(sentence.value)
    selection.removeAllRanges()
    selection.addRange(range)
  }
</script>

<template>
  <div class="md1-docs-selection-stack">
    <p class="md1-docs-selection-text">
      Material is the metaphor. <span ref="sentence">A material metaphor is the unifying theory of a rationalized space and a system of motion.</span> The material is grounded in tactile reality, inspired by the study of paper and ink.
    </p>

    <div>
      <Md1Button @click="onSelect">Select a sentence</Md1Button>
    </div>
  </div>
</template>

<style>
  .md1-docs-selection-stack {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-2, 16px);
  }

  .md1-docs-selection-text {
    max-width: 480px;
    margin: 0;
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-body-1-size, 14px);
    line-height: var(--md1-type-body-1-leading, 20px);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }

  /* Text selection in the accent: the selection token, the accent at 30%, under the primary text ink. */
  .md1-docs-selection-text::selection,
  .md1-docs-selection-text *::selection {
    background: var(--md1-selection, rgba(255, 64, 129, 0.3));
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }
</style>
