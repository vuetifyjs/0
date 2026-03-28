<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface HxDocLayoutProps extends V0PaperProps {
    /** Width of the navigation sidebar, forwarded as CSS variable */
    navWidth?: string
    /** Height of the app banner, forwarded as CSS variable */
    bannerHeight?: string
    /** Height of the app bar, forwarded as CSS variable */
    barHeight?: string
    /** ID of the main content landmark for skip link */
    mainId?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'HxDocLayout' })

  const {
    navWidth = '230px',
    bannerHeight = '24px',
    barHeight = '48px',
    mainId = 'main-content',
    ...paperProps
  } = defineProps<HxDocLayoutProps>()
</script>

<template>
  <a
    class="helix-doc-layout__skip"
    :href="`#${mainId}`"
  >
    Skip to content
  </a>

  <V0Paper
    v-bind="paperProps"
    as="div"
    class="helix-doc-layout"
    :style="{
      '--helix-doc-layout-nav-width': navWidth,
      '--helix-doc-layout-banner-height': bannerHeight,
      '--helix-doc-layout-bar-height': barHeight,
    }"
  >
    <slot />
  </V0Paper>
</template>

<style scoped>
  .helix-doc-layout {
    display: flex;
    flex-direction: column;
    min-height: 100dvh;
  }

  .helix-doc-layout__skip {
    position: fixed;
    top: -100%;
    left: 16px;
    z-index: 100;
    padding: 8px 16px;
  }

  .helix-doc-layout__skip:focus {
    top: 8px;
  }
</style>
