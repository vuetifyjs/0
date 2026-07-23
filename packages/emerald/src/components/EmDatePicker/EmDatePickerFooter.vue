<script lang="ts">
  export interface EmDatePickerFooterProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmDatePickerFooter' })
</script>

<template>
  <div class="emerald-date-picker__footer">
    <slot />
  </div>
</template>

<style scoped>
.emerald-date-picker__footer {
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  gap: var(--emerald-spacing-xs);
  width: 100%;
}
</style>
