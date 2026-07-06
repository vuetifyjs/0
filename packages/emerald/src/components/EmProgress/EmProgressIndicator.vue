<script lang="ts">
  export interface EmProgressIndicatorProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmProgressIndicator' })
</script>

<template>
  <div aria-hidden="true" class="emerald-progress__indicator">
    <slot />
  </div>
</template>

<style>
.emerald-progress__indicator {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: var(--emerald-text-b3-bold-weight, 600);
  font-size: var(--emerald-text-b3-size, 12px);
  line-height: var(--emerald-text-b3-height, 18px);
  color: var(--emerald-neutral-700, #757e85);
}
</style>
