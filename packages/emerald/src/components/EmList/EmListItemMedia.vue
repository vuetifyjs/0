<script lang="ts" setup>
  defineOptions({ name: 'EmListItemMedia' })
</script>

<template>
  <span class="emerald-list__media">
    <slot />
  </span>
</template>

<style>
  .emerald-list__media {
    position: relative;
    flex: none;
    display: inline-flex;
    align-items: center;
  }
</style>
