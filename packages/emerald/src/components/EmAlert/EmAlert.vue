<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  import type { V0PaperProps } from '@vuetify/paper'

  export interface EmAlertProps extends V0PaperProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmAlert' })

  const {} = defineProps<EmAlertProps>()
</script>

<template>
  <V0Paper as="div" class="emerald-alert">
    <slot />
  </V0Paper>
</template>
