<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface EmContainerProps extends V0PaperProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmContainer' })

  const {} = defineProps<EmContainerProps>()
</script>

<template>
  <V0Paper as="div" class="emerald-container">
    <slot />
  </V0Paper>
</template>
