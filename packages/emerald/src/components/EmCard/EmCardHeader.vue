<script lang="ts">
  export interface EmCardHeaderProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmCardHeader' })
</script>

<template>
  <div class="emerald-card__header">
    <slot />
  </div>
</template>

<style scoped>
.emerald-card__header {
  display: flex;
  flex-direction: column;
  gap: var(--emerald-spacing-2xs);
}
</style>
