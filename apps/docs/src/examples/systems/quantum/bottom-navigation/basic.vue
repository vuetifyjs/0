<script setup lang="ts">
  import { QuBottomNavigation } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const view = shallowRef('recents')
</script>

<template>
  <div class="quantum-docs-screen quantum-docs-bottom-nav-screen">
    <p class="quantum-docs-bottom-nav-view" role="status">
      Showing {{ view }}.
    </p>

    <QuBottomNavigation v-model="view" aria-label="Main">
      <QuBottomNavigation.Action icon="history" label="Recents" value="recents" />

      <QuBottomNavigation.Action icon="favorite" label="Favorites" value="favorites" />

      <QuBottomNavigation.Action icon="place" label="Nearby" value="nearby" />
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
