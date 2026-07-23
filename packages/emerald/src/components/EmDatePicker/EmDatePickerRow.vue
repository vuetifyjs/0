<script lang="ts">
  export interface EmDatePickerRowProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmDatePickerRow' })
</script>

<template>
  <div class="emerald-date-picker__row" role="row">
    <slot />
  </div>
</template>

<style scoped>
.emerald-date-picker__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  column-gap: var(--emerald-spacing-2xs);
  width: 100%;
}
</style>
