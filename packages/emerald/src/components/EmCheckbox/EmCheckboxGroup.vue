<script lang="ts">
  // Framework
  import { CheckboxGroup } from '@vuetify/v0'

  export interface EmCheckboxGroupProps {
    disabled?: boolean
    mandatory?: boolean | 'force'
    label?: string
    name?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmCheckboxGroup' })

  const {
    disabled = false,
    mandatory = false,
    label,
    name,
  } = defineProps<EmCheckboxGroupProps>()

  const model = defineModel<unknown[]>({ default: () => [] })
</script>

<template>
  <CheckboxGroup
    v-model="model"
    class="emerald-checkbox-group"
    :disabled
    :label
    :mandatory
    :name
  >
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </CheckboxGroup>
</template>

<style>
.emerald-checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
