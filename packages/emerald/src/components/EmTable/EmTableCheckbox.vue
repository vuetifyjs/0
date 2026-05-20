<script lang="ts">
  // Types
  import type { MaybeRefOrGetter } from 'vue'

  // Components
  import EmCheckbox from '../EmCheckbox/EmCheckbox.vue'

  export interface EmTableCheckboxProps {
    disabled?: MaybeRefOrGetter<boolean>
    indeterminate?: MaybeRefOrGetter<boolean>
    label?: string
    name?: string
    value?: unknown
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmTableCheckbox' })

  const {
    disabled = false,
    indeterminate = false,
    label = 'Select row',
    name,
    value,
  } = defineProps<EmTableCheckboxProps>()

  const model = defineModel<boolean>({ default: false })
</script>

<template>
  <td class="emerald-table__cell emerald-table__cell--checkbox">
    <EmCheckbox
      v-model="model"
      :aria-label="label"
      :disabled
      :indeterminate
      :name
      :value
    />
  </td>
</template>

<style>
.emerald-table__cell--checkbox {
  width: 1px;
  padding-right: 4px;
  white-space: nowrap;
}
</style>
