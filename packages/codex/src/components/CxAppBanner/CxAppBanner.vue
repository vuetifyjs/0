<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface CxAppBannerProps extends V0PaperProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxAppBanner' })

  const {} = defineProps<CxAppBannerProps>()
</script>

<template>
  <V0Paper as="div" class="codex-app-banner">
    <slot />
  </V0Paper>
</template>
