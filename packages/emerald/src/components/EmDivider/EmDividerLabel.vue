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
  display: inline-flex;
  align-items: center;
  padding: 0 8px;
  font-family: Manrope, system-ui, -apple-system, sans-serif;
  font-size: 12px;
  line-height: 1;
  color: var(--emerald-on-background);
  opacity: 0.6;
}

.emerald-divider[data-orientation="vertical"] .emerald-divider__label {
  padding: 8px 0;
  font-size: 12px;
}
</style>
