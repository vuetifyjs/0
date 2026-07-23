<script lang="ts">
  // Framework
  import { SelectContent } from '@vuetify/v0'

  export interface EmDatePickerSelectContentProps {
    eager?: boolean
    heading?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmDatePickerSelectContent' })

  const { eager = false, heading } = defineProps<EmDatePickerSelectContentProps>()
</script>

<template>
  <SelectContent class="emerald-date-picker__select-content" :eager>
    <template #default="slotProps">
      <div v-if="heading" class="emerald-date-picker__select-heading">
        {{ heading }}
      </div>

      <slot v-bind="slotProps" />
    </template>
  </SelectContent>
</template>

<style scoped>
.emerald-date-picker__select-content {
  flex-direction: column;
  align-items: stretch;
  box-sizing: border-box;
  width: 210px;
  max-height: 320px;
  overflow-y: auto;
  padding: var(--emerald-spacing-xs) var(--emerald-spacing-xs) var(--emerald-spacing-m);
  border: none;
  border-radius: var(--emerald-radius-m);
  background: var(--emerald-surface);
  box-shadow: var(--emerald-shadow-m);
  margin-top: var(--emerald-spacing-2xs);
  font-family: var(--emerald-font-sans);
  font-size: var(--emerald-text-b1-size);
  font-weight: var(--emerald-text-b1-weight);
  line-height: var(--emerald-text-b1-height);
  color: var(--emerald-on-surface);
}

.emerald-date-picker__select-content:popover-open {
  display: flex;
}

.emerald-date-picker__select-heading {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-shrink: 0;
  height: 36px;
  padding: var(--emerald-spacing-xs) var(--emerald-spacing-s) var(--emerald-spacing-xs) 0;
  font-weight: var(--emerald-text-b1-bold-weight);
  color: var(--emerald-secondary);
  opacity: 0.7;
  text-transform: uppercase;
}
</style>
