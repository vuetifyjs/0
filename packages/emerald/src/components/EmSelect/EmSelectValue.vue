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
  font-size: var(--emerald-text-b1-size);
  font-weight: var(--emerald-text-b1-weight);
  line-height: var(--emerald-text-b1-height);
  color: var(--emerald-on-surface);
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
