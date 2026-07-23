<script lang="ts">
  export interface EmDialogIconProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmDialogIcon' })
</script>

<template>
  <span class="emerald-dialog__icon">
    <slot />
  </span>
</template>

<style>
.emerald-dialog__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-sizing: border-box;
  width: var(--emerald-icon-xl, 32px);
  height: var(--emerald-icon-xl, 32px);
  padding: var(--emerald-spacing-2xs, 4px);
  border-radius: var(--emerald-radius-xs, 4px);
}
</style>
