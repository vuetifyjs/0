<script setup lang="ts">
  import { QuBottomNavigation } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const view = shallowRef('home')
</script>

<template>
  <div class="quantum-docs-screen quantum-docs-bottom-nav-screen">
    <p class="quantum-docs-bottom-nav-view" role="status">
      Showing {{ view }}.
    </p>

    <QuBottomNavigation v-model="view" aria-label="Main">
      <QuBottomNavigation.Action icon="home" label="Home" value="home" />

      <QuBottomNavigation.Action icon="search" label="Search" value="search" />

      <QuBottomNavigation.Action icon="notifications" label="Alerts" value="alerts" />

      <QuBottomNavigation.Action icon="person" label="Profile" value="profile" />
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
