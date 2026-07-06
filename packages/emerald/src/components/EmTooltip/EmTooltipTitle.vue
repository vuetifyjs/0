<script lang="ts">
  export interface EmTooltipTitleProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmTooltipTitle' })
</script>

<template>
  <span class="emerald-tooltip__title">
    <slot />
  </span>
</template>

<style>
.emerald-tooltip__title {
  font-size: var(--emerald-text-b2-size, 14px);
  line-height: var(--emerald-text-b2-height, 21px);
  font-weight: var(--emerald-text-b2-bold-weight, 600);
  white-space: nowrap;
}
</style>
