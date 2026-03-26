<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface EmLoadingProps extends V0PaperProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmLoading' })

  const {} = defineProps<EmLoadingProps>()
</script>

<template>
  <V0Paper as="div" class="emerald-loading">
    <slot />
  </V0Paper>
</template>
