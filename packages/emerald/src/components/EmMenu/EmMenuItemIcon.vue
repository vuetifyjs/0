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
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  color: var(--emerald-neutral-600);
}

.emerald-menu__item-icon svg,
.emerald-menu__item-icon :deep(svg) {
  width: 100%;
  height: 100%;
}
</style>
