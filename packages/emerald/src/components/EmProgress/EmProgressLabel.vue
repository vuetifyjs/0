<script lang="ts">
  export interface EmProgressLabelProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmProgressLabel' })
</script>

<template>
  <span class="emerald-progress__label">
    <slot />
  </span>
</template>

<style>
.emerald-progress__label {
  font-weight: var(--emerald-text-b3-bold-weight, 600);
  font-size: var(--emerald-text-b3-size, 12px);
  line-height: var(--emerald-text-b3-height, 18px);
  color: var(--emerald-on-surface, #2b2d2e);
  white-space: nowrap;
}
</style>
