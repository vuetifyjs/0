<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface EmDatePickerProps extends V0PaperProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmDatePicker' })

  const {} = defineProps<EmDatePickerProps>()
</script>

<template>
  <V0Paper as="div" class="emerald-date-picker">
    <slot />
  </V0Paper>
</template>
