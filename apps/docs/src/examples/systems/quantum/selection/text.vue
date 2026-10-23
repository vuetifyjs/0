<script setup lang="ts">
  import { QuButton } from '@paper/quantum'
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
  <div class="quantum-docs-selection-stack">
    <p class="quantum-docs-selection-text">
      Material is the metaphor. <span ref="sentence">A material metaphor is the unifying theory of a rationalized space and a system of motion.</span> The material is grounded in tactile reality, inspired by the study of paper and ink.
    </p>

    <div>
      <QuButton @click="onSelect">Select a sentence</QuButton>
    </div>
  </div>
</template>

<style>
  .quantum-docs-selection-stack {
    display: flex;
    flex-direction: column;
    gap: var(--quantum-spacing-2, 16px);
  }

  .quantum-docs-selection-text {
    max-width: 480px;
    margin: 0;
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-body-1-size, 14px);
    line-height: var(--quantum-type-body-1-leading, 20px);
    color: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
  }

  /* Text selection in the accent: the selection token, the accent at 30%, under the primary text ink. */
  .quantum-docs-selection-text::selection,
  .quantum-docs-selection-text *::selection {
    background: var(--quantum-selection, rgba(255, 64, 129, 0.3));
    color: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
  }
</style>
