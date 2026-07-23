<script lang="ts">
  // Framework
  import { ComboboxEmpty } from '@vuetify/v0'

  export interface EmAutoCompleteEmptyProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmAutoCompleteEmpty' })
</script>

<template>
  <ComboboxEmpty class="emerald-auto-complete__empty">
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </ComboboxEmpty>
</template>

<style>
.emerald-auto-complete__empty {
  display: flex;
  align-items: center;
  min-height: 36px;
  padding: var(--emerald-spacing-xs) var(--emerald-spacing-s);
  font-family: var(--emerald-font-sans);
  font-size: var(--emerald-text-b1-size);
  line-height: var(--emerald-text-b1-height);
  color: rgb(var(--emerald-on-surface-channels) / 0.5);
}
</style>
