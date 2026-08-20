<script lang="ts" setup>
  defineOptions({ name: 'EmListItemContent' })
</script>

<template>
  <span class="emerald-list__content">
    <slot />
  </span>
</template>

<style>
  .emerald-list__content {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: var(--emerald-spacing-3xs, 2px);
    min-width: 0;
  }
</style>
