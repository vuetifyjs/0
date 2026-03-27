<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface CxBackToTopProps extends V0PaperProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxBackToTop' })

  const {} = defineProps<CxBackToTopProps>()
</script>

<template>
  <V0Paper as="button" class="codex-back-to-top">
    <slot />
  </V0Paper>
</template>
