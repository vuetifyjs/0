<script setup lang="ts">
  import { Md1Button, Md1Toolbar } from '@paper/md1'
</script>

<template>
  <Md1Toolbar variant="primary">
    <Md1Toolbar.Nav icon="up" />

    <Md1Toolbar.Title>Flight to Lisbon</Md1Toolbar.Title>

    <Md1Toolbar.Actions>
      <Md1Button aria-label="Share" icon="share" />
    </Md1Toolbar.Actions>

    <Md1Toolbar.Extension>
      <p class="md1-docs-toolbar-related">Departs 10:40 from gate B12. Boarding closes 20 minutes before departure.</p>
    </Md1Toolbar.Extension>
  </Md1Toolbar>
</template>

<style>
  .md1-docs-toolbar-related {
    margin: 0;
    padding: var(--md1-spacing-2, 16px) var(--md1-keyline-margin, 16px);
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-body-1-size, 14px);
    line-height: var(--md1-type-body-1-leading, 20px);
  }
</style>
