<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface CxIconButtonProps extends V0PaperProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxIconButton' })

  const {} = defineProps<CxIconButtonProps>()
</script>

<template>
  <V0Paper as="button" class="codex-icon-button">
    <slot />
  </V0Paper>
</template>
