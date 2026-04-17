<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface EmRadioProps extends V0PaperProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmRadio' })

  const {} = defineProps<EmRadioProps>()
</script>

<template>
  <V0Paper as="div" class="emerald-radio">
    <slot />
  </V0Paper>
</template>
