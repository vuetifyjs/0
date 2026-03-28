<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface HxAppBarProps extends V0PaperProps {
    /** Height of the app bar */
    height?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'HxAppBar' })

  const {
    height = '48px',
    ...paperProps
  } = defineProps<HxAppBarProps>()
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    as="header"
    class="helix-app-bar"
    data-app-bar
    :style="{ height }"
  >
    <slot />
  </V0Paper>
</template>

<style scoped>
  .helix-app-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    inset-inline: 0;
    top: 0;
    z-index: 1;
  }
</style>
