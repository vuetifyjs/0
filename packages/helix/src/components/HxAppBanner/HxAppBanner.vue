<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface HxAppBannerProps extends V0PaperProps {
    /** Height of the banner */
    height?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'HxAppBanner' })

  const {
    height = '24px',
    ...paperProps
  } = defineProps<HxAppBannerProps>()
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    as="div"
    class="helix-app-banner"
    :style="{ height }"
  >
    <slot />
  </V0Paper>
</template>

<style scoped>
  .helix-app-banner {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    inset-inline: 0;
    top: 0;
    z-index: 1;
    background-color: var(--v0-warning);
    color: var(--v0-on-warning);
    font-size: 0.75rem;
    font-weight: 500;
  }
</style>
