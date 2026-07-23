<script lang="ts">
  export interface EmListItemTitleProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmListItemTitle' })
</script>

<template>
  <span class="emerald-list__item-title">
    <slot />
  </span>
</template>
