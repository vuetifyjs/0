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
  padding: 8px 12px;
  font-family: Manrope, system-ui, -apple-system, sans-serif;
  font-size: 12px;
  line-height: 20px;
  color: rgb(var(--emerald-neutral-channels, 26 28 30) / 0.5);
}
</style>
