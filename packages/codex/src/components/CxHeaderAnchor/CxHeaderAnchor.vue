<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface CxHeaderAnchorProps extends V0PaperProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxHeaderAnchor' })

  const {} = defineProps<CxHeaderAnchorProps>()
</script>

<template>
  <V0Paper as="h3" class="codex-header-anchor">
    <slot />
  </V0Paper>
</template>
