<script setup lang="ts">
  import { QuBottomNavigation, QuToolbar } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const titles: Record<string, string> = {
    recents: 'Recents',
    favorites: 'Favorites',
    nearby: 'Nearby',
  }

  const view = shallowRef('recents')
</script>

<template>
  <div class="quantum-docs-screen quantum-docs-nav-screen">
    <QuToolbar variant="primary">
      <QuToolbar.Title>{{ titles[view] }}</QuToolbar.Title>
    </QuToolbar>

    <p class="quantum-docs-nav-text" role="status">Showing {{ titles[view] }}. The bar stays put while the view above it changes.</p>

    <QuBottomNavigation v-model="view" aria-label="Main">
      <QuBottomNavigation.Action icon="history" label="Recents" value="recents" />

      <QuBottomNavigation.Action icon="favorite" label="Favorites" value="favorites" />

      <QuBottomNavigation.Action icon="place" label="Nearby" value="nearby" />
    </QuBottomNavigation>
  </div>
</template>

<style>
  /* A handset screen: the bar's fixed position resolves against this frame, not the page. */
  .quantum-docs-nav-screen {
    display: flex;
    flex-direction: column;
    max-width: 360px;
    background: var(--quantum-background, #FAFAFA);
  }

  .quantum-docs-nav-text {
    flex: 1 1 auto;
    min-width: 0;
    margin: 0;
    padding: var(--quantum-spacing-2, 16px);
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-body-1-size, 14px);
    line-height: var(--quantum-type-body-1-leading, 20px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
