<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface HxAppMainProps extends V0PaperProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'HxAppMain' })

  const { ...paperProps } = defineProps<HxAppMainProps>()
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    as="main"
  >
    <slot />
  </V0Paper>
</template>
