<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface CxAppMainProps extends V0PaperProps {
    /** Width of the sidebar to offset from */
    navWidth?: string
    /** Max width of the content area */
    maxWidth?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxAppMain' })

  const {
    navWidth = '230px',
    maxWidth = '730px',
    ...paperProps
  } = defineProps<CxAppMainProps>()
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    as="main"
    class="codex-app-main bg-background"
    :style="{
      '--codex-app-main-nav-width': navWidth,
      '--codex-app-main-max-width': maxWidth,
    }"
  >
    <slot />
  </V0Paper>
</template>

<style scoped>
  .codex-app-main {
    position: relative;
    margin-inline-start: 0;
  }

  @media (min-width: 768px) {
    .codex-app-main {
      margin-inline-start: var(--codex-app-main-nav-width);
    }
  }
</style>
