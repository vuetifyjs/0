<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface CxLinkProps extends V0PaperProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxLink' })

  const {} = defineProps<CxLinkProps>()
</script>

<template>
  <V0Paper as="a" class="codex-link">
    <slot />
  </V0Paper>
</template>
