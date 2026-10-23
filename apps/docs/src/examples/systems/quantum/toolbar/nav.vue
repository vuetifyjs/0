<script setup lang="ts">
  import { QuButton, QuToolbar } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const open = shallowRef(false)
</script>

<template>
  <div class="quantum-docs-toolbar-stack">
    <QuToolbar variant="primary">
      <QuToolbar.Nav :open @click="open = !open" />

      <QuToolbar.Title>{{ open ? 'Drawer open' : 'Photos' }}</QuToolbar.Title>
    </QuToolbar>

    <QuToolbar>
      <QuToolbar.Nav icon="up" />

      <QuToolbar.Title>Album</QuToolbar.Title>
    </QuToolbar>

    <QuToolbar>
      <QuToolbar.Nav icon="close" />

      <QuToolbar.Title>New event</QuToolbar.Title>

      <QuToolbar.Actions>
        <QuButton>Save</QuButton>
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
