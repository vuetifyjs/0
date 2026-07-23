<script lang="ts">
  export interface EmAlertIconProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmAlertIcon' })
</script>

<template>
  <span aria-hidden="true" class="emerald-alert__icon">
    <slot />
  </span>
</template>

<style scoped>
.emerald-alert__icon {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--emerald-icon-l);
  height: var(--emerald-icon-l);
  color: var(--emerald-alert-accent);
}
</style>
