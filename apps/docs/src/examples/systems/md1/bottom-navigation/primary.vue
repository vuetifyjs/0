<script setup lang="ts">
  import { Md1BottomNavigation } from '@paper/md1'
  import { shallowRef } from 'vue'

  const view = shallowRef('play')
</script>

<template>
  <div class="md1-docs-screen md1-docs-bottom-nav-screen">
    <p class="md1-docs-bottom-nav-view" role="status">
      Showing {{ view }}.
    </p>

    <Md1BottomNavigation v-model="view" aria-label="Music" variant="primary">
      <Md1BottomNavigation.Action icon="play-arrow" label="Listen now" value="play" />

      <Md1BottomNavigation.Action icon="history" label="Recent" value="recent" />

      <Md1BottomNavigation.Action icon="mic" label="Podcasts" value="podcasts" />
    </Md1BottomNavigation>
  </div>
</template>

<style>
  .md1-docs-bottom-nav-screen {
    background: var(--md1-background, #FAFAFA);
  }

  .md1-docs-bottom-nav-view {
    margin: 0;
    padding: var(--md1-spacing-2, 16px);
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-body-1-size, 14px);
    line-height: var(--md1-type-body-1-leading, 20px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
