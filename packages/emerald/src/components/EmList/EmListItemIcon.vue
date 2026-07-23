<script lang="ts">
  export interface EmListItemIconProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmListItemIcon' })
</script>

<template>
  <span aria-hidden="true" class="emerald-list__item-icon">
    <slot />
  </span>
</template>
