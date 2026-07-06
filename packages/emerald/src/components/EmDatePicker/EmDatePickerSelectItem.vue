<script lang="ts">
  // Framework
  import { SelectItem } from '@vuetify/v0'

  // Types
  import type { MaybeRefOrGetter } from 'vue'

  export interface EmDatePickerSelectItemProps {
    value?: unknown
    disabled?: MaybeRefOrGetter<boolean>
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmDatePickerSelectItem' })

  const { value, disabled = false } = defineProps<EmDatePickerSelectItemProps>()
</script>

<template>
  <SelectItem
    class="emerald-date-picker__select-item"
    :disabled
    :value
  >
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </SelectItem>
</template>

<style scoped>
.emerald-date-picker__select-item {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  min-height: 36px;
  width: 100%;
  padding: var(--emerald-spacing-xs) var(--emerald-spacing-s);
  border: none;
  border-left: var(--emerald-stroke-s) solid var(--emerald-divider);
  border-radius: 0 var(--emerald-radius-xs) var(--emerald-radius-xs) 0;
  background: transparent;
  font-family: inherit;
  font-size: var(--emerald-text-b1-size);
  font-weight: var(--emerald-text-b1-weight);
  line-height: var(--emerald-text-b1-height);
  color: var(--emerald-on-surface);
  cursor: pointer;
  overflow: clip;
}

.emerald-date-picker__select-item[data-focused],
.emerald-date-picker__select-item:hover {
  background: var(--emerald-neutral-200);
  border-left-color: var(--emerald-neutral-600);
}

.emerald-date-picker__select-item[data-selected] {
  background: var(--emerald-primary-100);
  border-left-color: var(--emerald-primary-600);
}

.emerald-date-picker__select-item[data-disabled] {
  color: var(--emerald-neutral-400);
  cursor: not-allowed;
  pointer-events: none;
}
</style>
