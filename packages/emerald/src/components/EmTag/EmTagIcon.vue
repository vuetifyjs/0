<script lang="ts">
  export interface EmTagIconProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmTagIcon' })
</script>

<template>
  <span aria-hidden="true" class="emerald-tag__icon">
    <slot />
  </span>
</template>

<style scoped>
.emerald-tag__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 16px;
  height: 16px;
}

.emerald-tag__icon :deep(svg) {
  width: 100%;
  height: 100%;
}
</style>
