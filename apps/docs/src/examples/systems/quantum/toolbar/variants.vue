<script setup lang="ts">
  import { QuButton, QuToolbar } from '@paper/quantum'
</script>

<template>
  <div class="quantum-docs-toolbar-stack">
    <QuToolbar>
      <QuToolbar.Nav icon="up" />

      <QuToolbar.Title>Surface (light or dark by theme)</QuToolbar.Title>

      <QuToolbar.Actions>
        <QuButton aria-label="Share" icon="share" />
      </QuToolbar.Actions>
    </QuToolbar>

    <QuToolbar variant="primary">
      <QuToolbar.Nav icon="up" />

      <QuToolbar.Title>Primary</QuToolbar.Title>

      <QuToolbar.Actions>
        <QuButton aria-label="Share" icon="share" />
      </QuToolbar.Actions>
    </QuToolbar>

    <QuToolbar variant="transparent">
      <QuToolbar.Nav icon="up" />

      <QuToolbar.Title>Transparent</QuToolbar.Title>

      <QuToolbar.Actions>
        <QuButton aria-label="Share" icon="share" />
      </QuToolbar.Actions>
    </QuToolbar>
  </div>
</template>

<style>
  .quantum-docs-toolbar-stack {
    display: flex;
    flex-direction: column;
    gap: var(--quantum-spacing-3, 24px);
  }
</style>
