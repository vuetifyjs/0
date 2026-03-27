<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface CxAppFooterProps extends V0PaperProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxAppFooter' })

  const {} = defineProps<CxAppFooterProps>()
</script>

<template>
  <V0Paper as="footer" class="codex-app-footer">
    <slot />
  </V0Paper>
</template>
