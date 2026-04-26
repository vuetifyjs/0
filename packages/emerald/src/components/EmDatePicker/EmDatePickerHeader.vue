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

<style>
.emerald-date-picker__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 5px;
  font-size: 14px;
  font-weight: 700;
  line-height: normal;
  color: #000000;
}

.emerald-date-picker__header > button,
.emerald-date-picker__header [role="button"] {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 12px;
  height: 12px;
  padding: 0;
  border: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
}
</style>
