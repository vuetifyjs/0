<script lang="ts">
  export interface EmTooltipHeaderProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmTooltipHeader' })
</script>

<template>
  <span class="emerald-tooltip__header">
    <slot />
  </span>
</template>

<style>
.emerald-tooltip__header {
  display: flex;
  align-items: center;
  gap: var(--emerald-spacing-2xs, 4px);
  width: 100%;
}
</style>
