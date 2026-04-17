<script lang="ts">
  // Framework
  import { InputControl } from '@vuetify/v0'

  export interface EmTextFieldControlProps {
    placeholder?: string
    autocomplete?: string
    maxlength?: number
    min?: number | string
    max?: number | string
    step?: number | string
    inputmode?: string
    pattern?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmTextFieldControl' })

  const {
    placeholder,
    autocomplete,
    maxlength,
    min,
    max,
    step,
    inputmode,
    pattern,
  } = defineProps<EmTextFieldControlProps>()
</script>

<template>
  <InputControl
    :autocomplete
    class="emerald-text-field__control"
    :inputmode
    :max
    :maxlength
    :min
    :pattern
    :placeholder
    :step
  >
    <slot />
  </InputControl>
</template>

<style scoped>
.emerald-text-field__control {
  width: 100%;
}
</style>
