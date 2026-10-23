<script setup lang="ts">
  import { Md1BottomNavigation, Md1Toolbar } from '@paper/md1'
  import { shallowRef } from 'vue'

  const titles: Record<string, string> = {
    recents: 'Recents',
    favorites: 'Favorites',
    nearby: 'Nearby',
  }

  const view = shallowRef('recents')
</script>

<template>
  <div class="md1-docs-screen md1-docs-nav-screen">
    <Md1Toolbar variant="primary">
      <Md1Toolbar.Title>{{ titles[view] }}</Md1Toolbar.Title>
    </Md1Toolbar>

    <p class="md1-docs-nav-text" role="status">Showing {{ titles[view] }}. The bar stays put while the view above it changes.</p>

    <Md1BottomNavigation v-model="view" aria-label="Main">
      <Md1BottomNavigation.Action icon="history" label="Recents" value="recents" />

      <Md1BottomNavigation.Action icon="favorite" label="Favorites" value="favorites" />

      <Md1BottomNavigation.Action icon="place" label="Nearby" value="nearby" />
    </Md1BottomNavigation>
  </div>
</template>

<style>
  /* A handset screen: the bar's fixed position resolves against this frame, not the page. */
  .md1-docs-nav-screen {
    display: flex;
    flex-direction: column;
    max-width: 360px;
    background: var(--md1-background, #FAFAFA);
  }

  .md1-docs-nav-text {
    flex: 1 1 auto;
    min-width: 0;
    margin: 0;
    padding: var(--md1-spacing-2, 16px);
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-body-1-size, 14px);
    line-height: var(--md1-type-body-1-leading, 20px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
