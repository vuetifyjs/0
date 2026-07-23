<script lang="ts">
  export interface EmCardBodyProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmCardBody' })
</script>

<template>
  <div class="emerald-card__body">
    <slot />
  </div>
</template>

<style scoped>
.emerald-card__body {
  display: flex;
  flex-direction: column;
  gap: var(--emerald-spacing-m);
  font: var(--emerald-text-b1-weight) var(--emerald-text-b1-size) / var(--emerald-text-b1-height) var(--emerald-font-sans);
  color: var(--emerald-neutral-700);
}
</style>
