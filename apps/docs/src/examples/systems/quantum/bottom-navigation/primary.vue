<script setup lang="ts">
  import { QuBottomNavigation } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const view = shallowRef('play')
</script>

<template>
  <div class="quantum-docs-screen quantum-docs-bottom-nav-screen">
    <p class="quantum-docs-bottom-nav-view" role="status">
      Showing {{ view }}.
    </p>

    <QuBottomNavigation v-model="view" aria-label="Music" variant="primary">
      <QuBottomNavigation.Action icon="play-arrow" label="Listen now" value="play" />

      <QuBottomNavigation.Action icon="history" label="Recent" value="recent" />

      <QuBottomNavigation.Action icon="mic" label="Podcasts" value="podcasts" />
    </QuBottomNavigation>
  </div>
</template>

<style>
  .quantum-docs-bottom-nav-screen {
    background: var(--quantum-background, #FAFAFA);
  }

  .quantum-docs-bottom-nav-view {
    margin: 0;
    padding: var(--quantum-spacing-2, 16px);
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-body-1-size, 14px);
    line-height: var(--quantum-type-body-1-leading, 20px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
