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
  font-size: var(--emerald-text-b1-size);
  font-weight: var(--emerald-text-b1-weight);
  line-height: var(--emerald-text-b1-height);
  color: var(--emerald-neutral-500);
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
