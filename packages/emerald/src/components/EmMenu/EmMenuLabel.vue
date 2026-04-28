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
  height: 36px;
  padding: 8px 12px 8px 0;
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  color: var(--emerald-primary-950);
  opacity: 0.7;
  user-select: none;
}
</style>
