<script lang="ts">
  export interface EmMenuLabelProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmMenuLabel' })
</script>

<template>
  <div class="emerald-menu__label" role="presentation">
    <slot />
  </div>
</template>

<style>
.emerald-menu__label {
  display: flex;
  align-items: center;
  min-height: 36px;
  padding-block: var(--emerald-spacing-xs);
  padding-inline: 0 var(--emerald-spacing-s);
  font-family: inherit;
  font-size: var(--emerald-text-b1-size);
  font-weight: 700;
  line-height: var(--emerald-text-b1-height);
  color: var(--emerald-secondary);
  opacity: 0.7;
  user-select: none;
}
</style>
