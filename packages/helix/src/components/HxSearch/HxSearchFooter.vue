<script lang="ts">
  export interface HxSearchFooterProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'HxSearchFooter' })
</script>

<template>
  <div class="helix-search__footer">
    <span class="helix-search__footer-hint"><kbd>↑↓</kbd> navigate</span>
    <span class="helix-search__footer-hint"><kbd>↵</kbd> select</span>
    <span class="helix-search__footer-hint"><kbd>esc</kbd> close</span>
  </div>
</template>

<style scoped>
  .helix-search__footer {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.5rem 1rem;
    border-top: 1px solid currentColor;
    opacity: 0.8;
    font-size: 0.75em;
  }

  .helix-search__footer-hint {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
</style>
