<script lang="ts">
  // Framework
  import { RadioGroup } from '@vuetify/v0'

  export interface EmRadioGroupProps {
    disabled?: boolean
    mandatory?: boolean | 'force'
    label?: string
    name?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmRadioGroup' })

  const {
    disabled = false,
    mandatory = false,
    label,
    name,
  } = defineProps<EmRadioGroupProps>()

  const model = defineModel<unknown>()
</script>

<template>
  <RadioGroup
    v-model="model"
    class="emerald-radio-group"
    :disabled
    :label
    :mandatory
    :name
  >
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </RadioGroup>
</template>

<style>
.emerald-radio-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
