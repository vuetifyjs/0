<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface CxDocLayoutProps extends V0PaperProps {
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
  defineOptions({ name: 'CxDocLayout' })

  const {
    navWidth = '230px',
    bannerHeight = '24px',
    barHeight = '48px',
    mainId = 'main-content',
    ...paperProps
  } = defineProps<CxDocLayoutProps>()
</script>

<template>
  <a
    class="codex-doc-layout__skip"
    :href="`#${mainId}`"
  >
    Skip to content
  </a>

  <V0Paper
    v-bind="paperProps"
    as="div"
    class="codex-doc-layout"
    :style="{
      '--codex-doc-layout-nav-width': navWidth,
      '--codex-doc-layout-banner-height': bannerHeight,
      '--codex-doc-layout-bar-height': barHeight,
    }"
  >
    <slot />
  </V0Paper>
</template>

<style scoped>
  .codex-doc-layout {
    display: flex;
    flex-direction: column;
    min-height: 100dvh;
  }

  .codex-doc-layout__skip {
    position: fixed;
    top: -100%;
    left: 16px;
    z-index: 100;
    padding: 8px 16px;
  }

  .codex-doc-layout__skip:focus {
    top: 8px;
  }
</style>
