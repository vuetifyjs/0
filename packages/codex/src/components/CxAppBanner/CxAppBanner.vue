<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface CxAppBannerProps extends V0PaperProps {
    /** Height of the banner */
    height?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxAppBanner' })

  const {
    height = '24px',
    ...paperProps
  } = defineProps<CxAppBannerProps>()
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    as="div"
    class="codex-app-banner"
    :style="{ height }"
  >
    <slot />
  </V0Paper>
</template>

<style scoped>
  .codex-app-banner {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    inset-inline: 0;
    top: 0;
    z-index: 1;
  }
</style>
