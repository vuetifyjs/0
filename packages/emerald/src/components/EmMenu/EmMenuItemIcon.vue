<script lang="ts">
  export interface EmMenuItemIconProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmMenuItemIcon' })
</script>

<template>
  <span aria-hidden="true" class="emerald-menu__item-icon">
    <slot />
  </span>
</template>

<style>
.emerald-menu__item-icon {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--emerald-spacing-xl);
  height: var(--emerald-spacing-xl);
}
</style>
