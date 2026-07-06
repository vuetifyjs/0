<script lang="ts">
  export interface EmToastIconProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmToastIcon' })
</script>

<template>
  <span aria-hidden="true" class="emerald-toast__icon">
    <slot />
  </span>
</template>

<style scoped>
.emerald-toast__icon {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--emerald-icon-l);
  height: var(--emerald-icon-l);
  border-radius: var(--emerald-radius-xs);
  background: var(--emerald-toast-icon);
  color: var(--emerald-neutral-100);
  overflow: clip;
}
</style>
