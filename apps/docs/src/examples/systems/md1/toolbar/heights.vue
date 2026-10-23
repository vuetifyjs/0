<script setup lang="ts">
  import { Md1Button, Md1Toolbar } from '@paper/md1'
</script>

<template>
  <div class="md1-docs-toolbar-stack">
    <Md1Toolbar variant="primary">
      <Md1Toolbar.Nav />

      <Md1Toolbar.Title>Standard</Md1Toolbar.Title>

      <Md1Toolbar.Actions>
        <Md1Button aria-label="Search" icon="search" />
      </Md1Toolbar.Actions>
    </Md1Toolbar>

    <Md1Toolbar dense variant="primary">
      <Md1Toolbar.Nav />

      <Md1Toolbar.Title>Dense</Md1Toolbar.Title>

      <Md1Toolbar.Actions>
        <Md1Button aria-label="Search" icon="search" />
      </Md1Toolbar.Actions>
    </Md1Toolbar>

    <Md1Toolbar prominent variant="primary">
      <Md1Toolbar.Nav />

      <Md1Toolbar.Title>Prominent</Md1Toolbar.Title>

      <Md1Toolbar.Actions>
        <Md1Button aria-label="Search" icon="search" />
      </Md1Toolbar.Actions>
    </Md1Toolbar>

    <Md1Toolbar dense prominent variant="primary">
      <Md1Toolbar.Nav />

      <Md1Toolbar.Title>Dense prominent</Md1Toolbar.Title>

      <Md1Toolbar.Actions>
        <Md1Button aria-label="Search" icon="search" />
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
