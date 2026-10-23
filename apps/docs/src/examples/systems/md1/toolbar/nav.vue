<script setup lang="ts">
  import { Md1Button, Md1Toolbar } from '@paper/md1'
  import { shallowRef } from 'vue'

  const open = shallowRef(false)
</script>

<template>
  <div class="md1-docs-toolbar-stack">
    <Md1Toolbar variant="primary">
      <Md1Toolbar.Nav :open @click="open = !open" />

      <Md1Toolbar.Title>{{ open ? 'Drawer open' : 'Photos' }}</Md1Toolbar.Title>
    </Md1Toolbar>

    <Md1Toolbar>
      <Md1Toolbar.Nav icon="up" />

      <Md1Toolbar.Title>Album</Md1Toolbar.Title>
    </Md1Toolbar>

    <Md1Toolbar>
      <Md1Toolbar.Nav icon="close" />

      <Md1Toolbar.Title>New event</Md1Toolbar.Title>

      <Md1Toolbar.Actions>
        <Md1Button>Save</Md1Button>
      </Md1Toolbar.Actions>
    </Md1Toolbar>
  </div>
</template>

<style>
  .md1-docs-toolbar-stack {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-3, 24px);
  }
</style>
