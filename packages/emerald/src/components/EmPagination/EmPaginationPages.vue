<script lang="ts">
  export interface EmPaginationPagesProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmPaginationPages' })
</script>

<template>
  <span class="emerald-pagination__pages">
    <slot />
  </span>
</template>

<style>
.emerald-pagination__pages {
  display: inline-flex;
  align-items: center;
  padding: var(--emerald-spacing-2xs) var(--emerald-spacing-xs);
  border-radius: var(--emerald-radius-m);
}
</style>
