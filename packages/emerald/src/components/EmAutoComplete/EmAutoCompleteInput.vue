<script lang="ts">
  // Framework
  import { ComboboxControl } from '@vuetify/v0'

  export interface EmAutoCompleteInputProps {
    placeholder?: string
    openOn?: 'focus' | 'input'
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmAutoCompleteInput' })

  const { placeholder, openOn = 'input' } = defineProps<EmAutoCompleteInputProps>()
</script>

<template>
  <ComboboxControl
    class="emerald-auto-complete__input"
    :open-on
    :placeholder
  >
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </ComboboxControl>
</template>

<style>
.emerald-auto-complete__input {
  flex: 1 1 auto;
  min-width: 0;
  padding: 0;
  border: none;
  outline: none;
  background: transparent;
  font-family: inherit;
  font-size: var(--emerald-text-b1-size);
  line-height: var(--emerald-text-b1-height);
  color: var(--emerald-on-surface);
}

.emerald-auto-complete__input::placeholder {
  color: var(--emerald-neutral-500);
}
</style>
