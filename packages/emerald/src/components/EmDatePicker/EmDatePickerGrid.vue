<script lang="ts">
  export interface EmDatePickerGridProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmDatePickerGrid' })
</script>

<template>
  <div class="emerald-date-picker__grid" role="grid">
    <slot />
  </div>
</template>

<style>
.emerald-date-picker__grid {
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  align-items: center;
  justify-content: center;
  gap: 3px;
  width: 220px;
  padding: 3px 2px;
}
</style>
