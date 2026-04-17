<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface EmStepperProps extends V0PaperProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmStepper' })

  const {} = defineProps<EmStepperProps>()
</script>

<template>
  <V0Paper as="div" class="emerald-stepper">
    <slot />
  </V0Paper>
</template>
