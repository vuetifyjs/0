<script lang="ts">
  export interface CxSearchFooterProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxSearchFooter' })
</script>

<template>
  <div class="codex-search__footer">
    <span class="codex-search__footer-hint"><kbd>↑↓</kbd> navigate</span>
    <span class="codex-search__footer-hint"><kbd>↵</kbd> select</span>
    <span class="codex-search__footer-hint"><kbd>esc</kbd> close</span>
  </div>
</template>

<style scoped>
  .codex-search__footer {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.5rem 1rem;
    border-top: 1px solid currentColor;
    opacity: 0.8;
    font-size: 0.75em;
  }

  .codex-search__footer-hint {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
</style>
