<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface CxPageNavigatorProps extends V0PaperProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxPageNavigator' })

  const {} = defineProps<CxPageNavigatorProps>()
</script>

<template>
  <V0Paper as="nav" class="codex-page-navigator">
    <slot />
  </V0Paper>
</template>
