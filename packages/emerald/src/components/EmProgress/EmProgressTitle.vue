<script lang="ts">
  export interface EmProgressTitleProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmProgressTitle' })
</script>

<template>
  <div class="emerald-progress__title">
    <slot />
  </div>
</template>

<style>
.emerald-progress__title {
  display: flex;
  align-items: center;
  gap: var(--emerald-spacing-2xs, 4px);
}

.emerald-progress__title .emerald-progress__value {
  margin-inline-start: auto;
}
</style>
