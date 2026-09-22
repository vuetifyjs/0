<script lang="ts" setup>
  defineOptions({ name: 'EmListItemTitle' })
</script>

<template>
  <span class="emerald-list__title">
    <slot />
  </span>
</template>

<style>
  .emerald-list__title {
    overflow: hidden;
    color: inherit;
    font-size: var(--emerald-text-b2-size, 14px);
    line-height: var(--emerald-text-b2-height, 21px);
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
