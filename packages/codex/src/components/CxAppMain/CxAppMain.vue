<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface CxAppMainProps extends V0PaperProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxAppMain' })

  const {} = defineProps<CxAppMainProps>()
</script>

<template>
  <V0Paper as="main" class="codex-app-main">
    <slot />
  </V0Paper>
</template>
