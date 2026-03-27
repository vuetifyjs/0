<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface CxCalloutProps extends V0PaperProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxCallout' })

  const {} = defineProps<CxCalloutProps>()
</script>

<template>
  <V0Paper as="div" class="codex-callout">
    <slot />
  </V0Paper>
</template>
