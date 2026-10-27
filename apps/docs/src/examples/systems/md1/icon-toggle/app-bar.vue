<script setup lang="ts">
  import { Md1Button, Md1IconToggle, Md1Toolbar } from '@paper/md1'

  import { shallowRef } from 'vue'

  const starred = shallowRef(false)
</script>

<template>
  <div class="md1-docs-icon-toggle-bar">
    <Md1Toolbar variant="primary">
      <Md1Toolbar.Nav />

      <Md1Toolbar.Title>Coastal trail</Md1Toolbar.Title>

      <Md1Toolbar.Actions>
        <Md1IconToggle v-model="starred" aria-label="Star" icon="star-border" icon-on="star" />

        <Md1Button aria-label="Share" icon="share" />
      </Md1Toolbar.Actions>
    </Md1Toolbar>

    <p class="md1-docs-icon-toggle-bar__text">Fourteen kilometres from the lighthouse to the harbour, with the tide out for the last stretch along the sand.</p>

    <p class="md1-docs-note" role="status">{{ starred ? 'Starred' : 'Not starred' }}</p>
  </div>
</template>

<style>
  /* A phone-width screen: the app bar on top and the article under it. */
  .md1-docs-icon-toggle-bar {
    box-sizing: border-box;
    inline-size: 100%;
    max-inline-size: 360px;
    overflow: hidden;
    background: var(--md1-background, #FAFAFA);
    border-radius: var(--md1-radius, 2px);
    box-shadow: var(--md1-elevation-2, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));
  }

  .md1-docs-icon-toggle-bar__text {
    margin: var(--md1-spacing-2, 16px);
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-body-1-size, 14px);
    line-height: var(--md1-type-body-1-leading, 20px);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }

  .md1-docs-icon-toggle-bar > .md1-docs-note {
    margin: var(--md1-spacing-2, 16px);
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
