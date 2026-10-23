<script setup lang="ts">
  import { QuBottomNavigation } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const view = shallowRef('photos')
</script>

<template>
  <div class="quantum-docs-screen quantum-docs-bottom-nav-screen">
    <p class="quantum-docs-bottom-nav-view" role="status">
      Showing {{ view }}.
    </p>

    <QuBottomNavigation v-model="view" aria-label="Library" shifting>
      <QuBottomNavigation.Action icon="photo" label="Photos" value="photos" />

      <QuBottomNavigation.Action icon="star" label="Starred" value="starred" />

      <QuBottomNavigation.Action icon="share" label="Shared" value="shared" />

      <QuBottomNavigation.Action icon="folder" label="Albums" value="albums" />

      <QuBottomNavigation.Action icon="delete" label="Trash" value="trash" />
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
