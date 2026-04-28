<script lang="ts">
  export interface EmDatePickerCalendarProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmDatePickerCalendar' })
</script>

<template>
  <div class="emerald-date-picker__calendar">
    <slot />
  </div>
</template>

<style>
.emerald-date-picker__calendar {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 12px;
  width: 100%;
}
</style>
