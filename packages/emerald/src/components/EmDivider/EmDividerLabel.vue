<script lang="ts">
  export interface EmDividerLabelProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmDividerLabel' })
</script>

<template>
  <span class="emerald-divider__label">
    <slot />
  </span>
</template>

<style>
.emerald-divider__label {
  flex-shrink: 0;
  padding: 0 4px;
  font-family: Manrope, system-ui, -apple-system, sans-serif;
  font-size: 14px;
  line-height: normal;
  color: var(--emerald-on-background);
  opacity: 0.6;
}

.emerald-divider[data-orientation="vertical"] .emerald-divider__label {
  padding: 4px 0;
  font-size: 12px;
}
</style>
