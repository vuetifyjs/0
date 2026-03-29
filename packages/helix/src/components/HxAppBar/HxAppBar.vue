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
    data-app-bar
    :style="{ height }"
  >
    <slot />
  </V0Paper>
</template>
