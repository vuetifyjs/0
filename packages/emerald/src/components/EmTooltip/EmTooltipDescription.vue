<script lang="ts">
  export interface EmTooltipDescriptionProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmTooltipDescription' })
</script>

<template>
  <span class="emerald-tooltip__description">
    <slot />
  </span>
</template>

<style>
.emerald-tooltip__description {
  display: block;
  font-size: var(--emerald-text-b3-size, 12px);
  font-weight: var(--emerald-text-b3-weight, 400);
  line-height: var(--emerald-text-b3-height, 18px);
  overflow-wrap: break-word;
}
</style>
