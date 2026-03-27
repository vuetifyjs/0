<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface CxLoaderIconProps extends V0PaperProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxLoaderIcon' })

  const {} = defineProps<CxLoaderIconProps>()
</script>

<template>
  <V0Paper as="span" class="codex-loader-icon">
    <slot />
  </V0Paper>
</template>
