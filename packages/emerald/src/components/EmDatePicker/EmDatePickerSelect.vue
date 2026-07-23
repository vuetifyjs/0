<script lang="ts">
  // Framework
  import { SelectRoot } from '@vuetify/v0'

  // Types
  import type { ID } from '@vuetify/v0'

  export interface EmDatePickerSelectProps {
    disabled?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmDatePickerSelect' })

  const { disabled = false } = defineProps<EmDatePickerSelectProps>()

  const model = defineModel<ID | undefined>()
</script>

<template>
  <SelectRoot v-model="model" :disabled>
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </SelectRoot>
</template>
