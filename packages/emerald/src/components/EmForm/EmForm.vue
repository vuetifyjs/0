<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface EmFormProps extends V0PaperProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmForm' })

  const {} = defineProps<EmFormProps>()
</script>

<template>
  <V0Paper as="form" class="emerald-form">
    <slot />
  </V0Paper>
</template>
