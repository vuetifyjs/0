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
  font-size: 12px;
  line-height: 20px;
  color: #000000;
}

.emerald-auto-complete__input::placeholder {
  color: #000000;
  opacity: 0.3;
}
</style>
