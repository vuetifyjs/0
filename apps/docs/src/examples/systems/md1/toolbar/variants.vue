<script setup lang="ts">
  import { Md1Button, Md1Toolbar } from '@paper/md1'
</script>

<template>
  <div class="md1-docs-toolbar-stack">
    <Md1Toolbar>
      <Md1Toolbar.Nav icon="up" />

      <Md1Toolbar.Title>Surface</Md1Toolbar.Title>

      <Md1Toolbar.Actions>
        <Md1Button aria-label="Share" icon="share" />
      </Md1Toolbar.Actions>
    </Md1Toolbar>

    <Md1Toolbar variant="primary">
      <Md1Toolbar.Nav icon="up" />

      <Md1Toolbar.Title>Primary</Md1Toolbar.Title>

      <Md1Toolbar.Actions>
        <Md1Button aria-label="Share" icon="share" />
      </Md1Toolbar.Actions>
    </Md1Toolbar>

    <Md1Toolbar variant="transparent">
      <Md1Toolbar.Nav icon="up" />

      <Md1Toolbar.Title>Transparent</Md1Toolbar.Title>

      <Md1Toolbar.Actions>
        <Md1Button aria-label="Share" icon="share" />
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
