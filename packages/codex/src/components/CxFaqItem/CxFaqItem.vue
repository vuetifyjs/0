<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface CxFaqItemProps extends V0PaperProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxFaqItem' })

  const {} = defineProps<CxFaqItemProps>()
</script>

<template>
  <V0Paper as="div" class="codex-faq-item">
    <slot />
  </V0Paper>
</template>
