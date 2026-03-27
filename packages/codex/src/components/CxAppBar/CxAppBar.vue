<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface CxAppBarProps extends V0PaperProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxAppBar' })

  const {} = defineProps<CxAppBarProps>()
</script>

<template>
  <V0Paper as="header" class="codex-app-bar">
    <slot />
  </V0Paper>
</template>
