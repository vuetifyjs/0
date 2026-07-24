<script lang="ts">
  // Framework
  import { Select } from '@vuetify/v0'
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmSelectValue' })
</script>

<template>
  <Select.Value v-slot="slotProps" class="emerald-select__value">
    <slot v-bind="slotProps">{{ slotProps.selectedValue }}</slot>
  </Select.Value>
</template>

<style>
  .emerald-select__value {
    flex: 1;
    min-width: 0;
    text-align: start;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
