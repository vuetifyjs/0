<script lang="ts">
  export interface EmAlertBodyProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmAlertBody' })
</script>

<template>
  <div class="emerald-alert__body">
    <slot />
  </div>
</template>

<style scoped>
.emerald-alert__body {
  display: flex;
  flex: 1 0 0;
  flex-direction: column;
  gap: var(--emerald-spacing-2xs);
  min-width: 0;
}
</style>
