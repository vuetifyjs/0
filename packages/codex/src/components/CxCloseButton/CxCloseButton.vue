<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface CxCloseButtonProps extends V0PaperProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxCloseButton' })

  const {} = defineProps<CxCloseButtonProps>()
</script>

<template>
  <V0Paper as="button" class="codex-close-button">
    <slot />
  </V0Paper>
</template>
