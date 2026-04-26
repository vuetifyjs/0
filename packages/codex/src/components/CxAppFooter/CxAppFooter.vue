<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface CxAppFooterProps extends V0PaperProps {
    /** Offset footer by sidebar width */
    inset?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxAppFooter' })

  const {
    inset = false,
    ...paperProps
  } = defineProps<CxAppFooterProps>()
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    as="footer"
    class="codex-app-footer"
    :data-inset="inset || undefined"
  >
    <slot />
  </V0Paper>
</template>
