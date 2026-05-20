<script lang="ts">
  export interface EmListItemBadgeProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmListItemBadge' })
</script>

<template>
  <span class="emerald-list__item-badge">
    <slot />
  </span>
</template>

<style>
.emerald-list__item-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  padding: 2px 8px;
  min-width: 20px;
  height: 20px;
  border-radius: 9999px;
  background: var(--emerald-primary-100, #ede9fe);
  color: var(--emerald-primary-700, #4f30c4);
  font-family: Manrope, system-ui, -apple-system, sans-serif;
  font-size: 11px;
  font-weight: 600;
  line-height: 1;
  flex-shrink: 0;
}

.emerald-list__item[data-disabled] .emerald-list__item-badge {
  opacity: 0.5;
}
</style>
