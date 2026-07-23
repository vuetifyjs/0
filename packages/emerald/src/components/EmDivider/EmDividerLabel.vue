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
  padding: 0 var(--emerald-spacing-xs);
  font-family: var(--emerald-font-sans);
  font-size: var(--emerald-text-b2-size);
  font-weight: var(--emerald-text-b2-weight);
  line-height: var(--emerald-text-b2-height);
  color: var(--emerald-on-background);
  opacity: 0.6;
}

.emerald-divider[data-orientation="vertical"] .emerald-divider__label {
  padding: var(--emerald-spacing-xs) 0;
}
</style>
