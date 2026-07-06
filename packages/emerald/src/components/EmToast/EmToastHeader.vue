<script lang="ts">
  export interface EmToastHeaderProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmToastHeader' })
</script>

<template>
  <div class="emerald-toast__header">
    <slot />
  </div>
</template>

<style scoped>
.emerald-toast__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--emerald-spacing-2xs);
  width: 100%;
  min-height: var(--emerald-icon-l);
}
</style>
