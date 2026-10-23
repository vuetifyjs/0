<script setup lang="ts">
  import { QuButton, QuToolbar } from '@paper/quantum'
</script>

<template>
  <QuToolbar variant="primary">
    <QuToolbar.Nav icon="up" />

    <QuToolbar.Title>Flight to Lisbon</QuToolbar.Title>

    <QuToolbar.Actions>
      <QuButton aria-label="Share" icon="share" />
    </QuToolbar.Actions>

    <QuToolbar.Extension>
      <p class="quantum-docs-toolbar-related">Departs 10:40 from gate B12. Boarding closes 20 minutes before departure.</p>
    </QuToolbar.Extension>
  </QuToolbar>
</template>

<style>
  .quantum-docs-toolbar-related {
    margin: 0;
    padding: var(--quantum-spacing-2, 16px) var(--quantum-keyline-margin, 16px);
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-body-1-size, 14px);
    line-height: var(--quantum-type-body-1-leading, 20px);
  }
</style>
