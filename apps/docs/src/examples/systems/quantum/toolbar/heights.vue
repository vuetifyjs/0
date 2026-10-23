<script setup lang="ts">
  import { QuButton, QuToolbar } from '@paper/quantum'
</script>

<template>
  <div class="quantum-docs-toolbar-stack">
    <QuToolbar variant="primary">
      <QuToolbar.Nav />

      <QuToolbar.Title>Standard, 56 or 64 dp</QuToolbar.Title>

      <QuToolbar.Actions>
        <QuButton aria-label="Search" icon="search" />
      </QuToolbar.Actions>
    </QuToolbar>

    <QuToolbar dense variant="primary">
      <QuToolbar.Nav />

      <QuToolbar.Title>Dense</QuToolbar.Title>

      <QuToolbar.Actions>
        <QuButton aria-label="Search" icon="search" />
      </QuToolbar.Actions>
    </QuToolbar>

    <QuToolbar prominent variant="primary">
      <QuToolbar.Nav />

      <QuToolbar.Title>Prominent</QuToolbar.Title>

      <QuToolbar.Actions>
        <QuButton aria-label="Search" icon="search" />
      </QuToolbar.Actions>
    </QuToolbar>

    <QuToolbar dense prominent variant="primary">
      <QuToolbar.Nav />

      <QuToolbar.Title>Dense prominent</QuToolbar.Title>

      <QuToolbar.Actions>
        <QuButton aria-label="Search" icon="search" />
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
