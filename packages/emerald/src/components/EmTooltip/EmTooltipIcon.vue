<script lang="ts">
  export interface EmTooltipIconProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmTooltipIcon' })
</script>

<template>
  <span class="emerald-tooltip__icon">
    <slot />
  </span>
</template>

<style>
.emerald-tooltip__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--emerald-icon-s, 18px);
  height: var(--emerald-icon-s, 18px);
  flex-shrink: 0;
}

.emerald-tooltip__icon svg,
.emerald-tooltip__icon img {
  width: 100%;
  height: 100%;
}
</style>
