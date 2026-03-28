<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface HxAppMainProps extends V0PaperProps {
    /** Width of the sidebar to offset from */
    navWidth?: string
    /** Max width of the content area */
    maxWidth?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'HxAppMain' })

  const {
    navWidth = '230px',
    maxWidth = '730px',
    ...paperProps
  } = defineProps<HxAppMainProps>()
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    as="main"
    class="helix-app-main"
    :style="{
      '--helix-app-main-nav-width': navWidth,
      '--helix-app-main-max-width': maxWidth,
    }"
  >
    <slot />
  </V0Paper>
</template>

<style scoped>
  .helix-app-main {
    position: relative;
    margin-inline-start: 0;
  }

  @media (min-width: 768px) {
    .helix-app-main {
      margin-inline-start: var(--helix-app-main-nav-width);
    }
  }
</style>
