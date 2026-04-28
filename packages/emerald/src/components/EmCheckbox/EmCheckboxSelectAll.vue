<script lang="ts">
  // Framework
  import { CheckboxSelectAll } from '@vuetify/v0'

  export interface EmCheckboxSelectAllProps {
    label?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmCheckboxSelectAll' })

  const { label } = defineProps<EmCheckboxSelectAllProps>()
</script>

<template>
  <CheckboxSelectAll class="emerald-checkbox-select-all" :label>
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </CheckboxSelectAll>
</template>
