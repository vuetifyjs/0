<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface CxApiTableProps extends V0PaperProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxApiTable' })

  const {} = defineProps<CxApiTableProps>()
</script>

<template>
  <V0Paper as="div" class="codex-api-table">
    <slot />
  </V0Paper>
</template>
