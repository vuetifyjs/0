<script lang="ts">
  export interface EmDatePickerInputProps {
    placeholder?: string
    disabled?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmDatePickerInput' })

  const { placeholder, disabled = false } = defineProps<EmDatePickerInputProps>()

  const model = defineModel<string>({ default: '' })
</script>

<template>
  <input
    v-model="model"
    class="emerald-date-picker__input"
    :disabled
    :placeholder
    type="text"
  >
</template>

<style>
.emerald-date-picker__input {
  width: 100%;
  box-sizing: border-box;
  padding: 6px 10px;
  border: 1px solid rgb(0 0 0 / 0.12);
  border-radius: 4px;
  background: #ffffff;
  font-family: inherit;
  font-size: 12px;
  font-weight: 500;
  line-height: normal;
  color: #000000;
}

.emerald-date-picker__input::placeholder {
  color: rgb(0 0 0 / 0.45);
}

.emerald-date-picker__input:focus {
  outline: none;
  border-color: var(--emerald-primary-500, #18b48c);
  box-shadow: 0 0 0 2px rgb(var(--emerald-primary-500-channels, 24 180 140) / 0.15);
}
</style>
