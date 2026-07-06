<script lang="ts">
  export interface EmDatePickerHeaderProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmDatePickerHeader' })
</script>

<template>
  <div class="emerald-date-picker__header">
    <slot />
  </div>
</template>

<style scoped>
.emerald-date-picker__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  font-size: var(--emerald-text-b1-size);
  font-weight: var(--emerald-text-b1-bold-weight);
  line-height: var(--emerald-text-b1-height);
  color: var(--emerald-on-surface);
}
</style>
