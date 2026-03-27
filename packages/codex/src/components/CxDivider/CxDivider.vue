<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface CxDividerProps extends V0PaperProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxDivider' })

  const {} = defineProps<CxDividerProps>()
</script>

<template>
  <V0Paper as="hr" class="codex-divider">
    <slot />
  </V0Paper>
</template>
