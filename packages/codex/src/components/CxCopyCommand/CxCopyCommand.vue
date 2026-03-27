<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface CxCopyCommandProps extends V0PaperProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxCopyCommand' })

  const {} = defineProps<CxCopyCommandProps>()
</script>

<template>
  <V0Paper as="div" class="codex-copy-command">
    <slot />
  </V0Paper>
</template>
