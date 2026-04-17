<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface CxAppBarProps extends V0PaperProps {
    /** Height of the app bar */
    height?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxAppBar' })

  const {
    height = '48px',
    ...paperProps
  } = defineProps<CxAppBarProps>()
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    as="header"
    class="codex-app-bar"
    data-app-bar
    :style="{ height }"
  >
    <slot />
  </V0Paper>
</template>

<style scoped>
  .codex-app-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    inset-inline: 0;
    top: 0;
    z-index: 1;
  }
</style>
