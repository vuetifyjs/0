<script setup lang="ts">
  import { Md1BottomNavigation } from '@paper/md1'
  import { shallowRef } from 'vue'

  const view = shallowRef('photos')
</script>

<template>
  <div class="md1-docs-screen md1-docs-bottom-nav-screen">
    <p class="md1-docs-bottom-nav-view" role="status">
      Showing {{ view }}.
    </p>

    <Md1BottomNavigation v-model="view" aria-label="Library" shifting>
      <Md1BottomNavigation.Action icon="photo" label="Photos" value="photos" />

      <Md1BottomNavigation.Action icon="star" label="Starred" value="starred" />

      <Md1BottomNavigation.Action icon="share" label="Shared" value="shared" />

      <Md1BottomNavigation.Action icon="folder" label="Albums" value="albums" />

      <Md1BottomNavigation.Action icon="delete" label="Trash" value="trash" />
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
