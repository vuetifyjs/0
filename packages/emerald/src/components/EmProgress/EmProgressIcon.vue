<script lang="ts">
  export interface EmProgressIconProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmProgressIcon' })
</script>

<template>
  <span aria-hidden="true" class="emerald-progress__icon">
    <slot />
  </span>
</template>

<style>
.emerald-progress__icon {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--emerald-spacing-m, 16px);
  height: var(--emerald-spacing-m, 16px);
  color: var(--emerald-on-surface, #2b2d2e);
}
</style>
