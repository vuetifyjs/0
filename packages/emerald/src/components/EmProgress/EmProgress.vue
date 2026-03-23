<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  import type { V0PaperProps } from '@vuetify/paper'

  export interface EmProgressProps extends V0PaperProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmProgress' })

  const {} = defineProps<EmProgressProps>()
</script>

<template>
  <V0Paper as="div" class="emerald-progress">
    <slot />
  </V0Paper>
</template>
