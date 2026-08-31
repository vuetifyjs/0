<script lang="ts" setup>
  defineOptions({ name: 'EmListItemMeta' })
</script>

<template>
  <span class="emerald-list__meta">
    <slot />
  </span>
</template>

<style>
  .emerald-list__meta {
    flex: none;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
    line-height: var(--emerald-text-b3-height, 18px);
  }
</style>
