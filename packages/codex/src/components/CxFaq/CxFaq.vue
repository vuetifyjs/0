<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface CxFaqProps extends V0PaperProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxFaq' })

  const {} = defineProps<CxFaqProps>()
</script>

<template>
  <V0Paper as="div" class="codex-faq">
    <slot />
  </V0Paper>
</template>
