<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  import type { V0PaperProps } from '@vuetify/paper'

  export interface EmToastProps extends V0PaperProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmToast' })

  const {} = defineProps<EmToastProps>()
</script>

<template>
  <V0Paper as="div" class="emerald-toast">
    <slot />
  </V0Paper>
</template>
