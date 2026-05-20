<script lang="ts">
  export interface EmMenuItemShortcutProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmMenuItemShortcut' })
</script>

<template>
  <span class="emerald-menu__item-shortcut">
    <slot />
  </span>
</template>

<style>
.emerald-menu__item-shortcut {
  margin-left: auto;
  padding-left: 16px;
  font-size: 12px;
  font-weight: 500;
  color: var(--emerald-neutral-500);
  letter-spacing: 0.02em;
  flex-shrink: 0;
}

.emerald-menu__item[data-disabled] .emerald-menu__item-shortcut {
  opacity: 0.6;
}
</style>
