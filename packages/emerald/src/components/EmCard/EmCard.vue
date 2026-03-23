<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  import type { V0PaperProps } from '@vuetify/paper'

  export interface EmCardProps extends V0PaperProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmCard' })

  const {} = defineProps<EmCardProps>()
</script>

<template>
  <V0Paper as="div" class="emerald-card">
    <slot />
  </V0Paper>
</template>
