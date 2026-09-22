<script lang="ts" setup>
  defineOptions({ name: 'EmListItemSubtitle' })
</script>

<template>
  <span class="emerald-list__subtitle">
    <slot />
  </span>
</template>

<style>
  .emerald-list__subtitle {
    overflow: hidden;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
    line-height: var(--emerald-text-b3-height, 18px);
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
