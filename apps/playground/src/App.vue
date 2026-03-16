<script setup lang="ts">
</script>

<template>
  <router-view />
</template>

<style>
  .shiki {
    --shiki-light-bg: var(--v0-surface) !important;
    --shiki-dark-bg: var(--v0-surface) !important;
    background-color: var(--shiki-light-bg);
    border: thin solid var(--v0-divider);
    border-radius: 0.5rem;
    padding: 1rem;
    overflow-x: auto;
  }

  .shiki span {
    color: var(--shiki-light);
  }

  [data-theme="light"] .shiki {
    background-color: var(--shiki-light-bg);
  }

  [data-theme="dark"] .shiki {
    background-color: var(--shiki-dark-bg);
  }

  [data-theme="light"] .shiki span {
    color: var(--shiki-light);
  }

  [data-theme="dark"] .shiki span {
    color: var(--shiki-dark);
  }
</style>
