<script lang="ts">
  // Framework
  import { SelectPlaceholder } from '@vuetify/v0'

  export interface EmSelectPlaceholderProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmSelectPlaceholder' })
</script>

<template>
  <SelectPlaceholder class="emerald-select__placeholder">
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </SelectPlaceholder>
</template>

<style>
.emerald-select__placeholder {
  flex: 1 1 auto;
  min-width: 0;
  font-family: inherit;
  font-size: 12px;
  line-height: 20px;
  color: #000000;
  opacity: 0.3;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
