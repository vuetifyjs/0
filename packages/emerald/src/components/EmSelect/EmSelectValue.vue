<script lang="ts">
  // Framework
  import { SelectValue } from '@vuetify/v0'

  export interface EmSelectValueProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmSelectValue' })
</script>

<template>
  <SelectValue class="emerald-select__value">
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </SelectValue>
</template>

<style>
.emerald-select__value {
  flex: 1 1 auto;
  min-width: 0;
  font-family: inherit;
  font-size: 12px;
  line-height: 20px;
  color: #000000;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
