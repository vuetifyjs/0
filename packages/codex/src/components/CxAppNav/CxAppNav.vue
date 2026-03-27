<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface CxAppNavProps extends V0PaperProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxAppNav' })

  const {} = defineProps<CxAppNavProps>()
</script>

<template>
  <V0Paper as="nav" class="codex-app-nav">
    <slot />
  </V0Paper>
</template>
